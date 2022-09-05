import "../setup";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import * as errorHandlingUtils from "../utils/errorHandlingUtils";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as cardsRepository from "../repositories/cardsRepository";
import * as cardsUtils from "../utils/cardsUtils";
import * as rechargesRepository from "../repositories/rechargesRepository";
import * as paymentsRepository from "../repositories/paymentsRepository";

export async function calculateBalance(cardId: number) {
    const transactions: paymentsRepository.PaymentWithBusinessName[] = await paymentsRepository.findByCardId(cardId); 
    const recharges: rechargesRepository.Recharge[] = await rechargesRepository.findByCardId(cardId);
    
    const totalTransactions: number = cardsUtils.calculateTotalAmount(transactions);
    const totalRecharges: number = cardsUtils.calculateTotalAmount(recharges);
     
    let balance = totalRecharges - totalTransactions;
     
    if(balance < 0) balance = 0;

    return { balance, transactions, recharges };
}

export async function checkIfTheApiKeyIsValid(apiKey: string | undefined) {
    if(!apiKey) throw errorHandlingUtils.notSend("API key");
    
    const company: companyRepository.Company | undefined = await companyRepository.findByApiKey(apiKey); 

    if(!company) throw errorHandlingUtils.invalid("API key");
}

export async function checkIfTheCardExists(cardId: number) {
    const card: cardsRepository.Card | undefined = await cardsRepository.findById(cardId);

    if(!card) throw errorHandlingUtils.notFound("Card");

    return card;
}

export function checksThatTheCardIsNotExpired(card: cardsRepository.Card) {
    if(dayjs(dayjs().format("MM/YY")).isAfter(card.expirationDate)) {
        throw errorHandlingUtils.expired("card"); 
    }
}
 
function checkPasswordFormat(password: string) {
    const passwordRegex: RegExp = /^[0-9]{4}$/;

    if(!passwordRegex.test(password)) {
        throw errorHandlingUtils.invalid("password format"); 
    }
}

export function validatePassword(password: string, encryptedPassword: string | undefined) {
    checkPasswordFormat(password);

    if(!encryptedPassword) {
        throw errorHandlingUtils.notActivated("Card"); 
    }

    if(!bcrypt.compareSync(password, encryptedPassword)) {
        throw errorHandlingUtils.invalid("password"); 
    }
}

export async function createCard(data: { employeeId: number, type: cardsRepository.TransactionTypes }, apiKey: string | undefined) {
    await checkIfTheApiKeyIsValid(apiKey);

    const employee: employeeRepository.Employee | undefined = await employeeRepository.findById(data.employeeId); 

    if(!employee) throw errorHandlingUtils.notFound("Employee"); 

    const employeeCards: cardsRepository.Card | undefined = await cardsRepository.findByTypeAndEmployeeId(data.type, data.employeeId);

    if(employeeCards) throw errorHandlingUtils.typeConflict("Card"); 

    const cardNumber: string = faker.finance.account(16);
    const nameOnCard: string = cardsUtils.generateNameOnCard(employee.fullName);
    const expirationDate: string = dayjs().add(5, "year").format("MM/YY");
    const cvc: string = faker.finance.creditCardCVV();
    
    const encryptedCvc: string = cardsUtils.encryptCvc(cvc);
    
    const card: cardsRepository.CardInsertData = {
        number: cardNumber,
        employeeId: data.employeeId,
        cardholderName: nameOnCard,
        securityCode: encryptedCvc,
        expirationDate,
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: false,
        type: data.type
    }

    const { id } = await cardsRepository.insert(card);

    return {
        id, 
        number: cardNumber,
        employeeId: data.employeeId,
        cardholderName: nameOnCard,
        securityCode: cvc,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type: data.type
    }
}

export async function activateCard(cardInfo: { cardId: number, cvc: string, password: string }) {
    const { cardId, cvc, password } = cardInfo;

    const card: cardsRepository.Card = await checkIfTheCardExists(cardId);

    checksThatTheCardIsNotExpired(card);

    if(card.password) throw errorHandlingUtils.activated("card"); 

    const decryptedCvc: string = cardsUtils.decryptCvc(card.securityCode);

    if(cvc !== decryptedCvc) throw errorHandlingUtils.invalid("CVC");    

    checkPasswordFormat(password);

    const saltRounds: number = 10;
    const cryptedPassword: string = bcrypt.hashSync(password, saltRounds);

    const cardUpdated: cardsRepository.CardUpdateData = {
        password: cryptedPassword
        // originalCardId: cardId,
        // isBlocked: false
    };
    
    await cardsRepository.update(cardId, cardUpdated);
}

export async function viewCardBalanceAndTransactions(cardId: number | undefined) {
    if(!cardId) throw errorHandlingUtils.notSend("Card id");    

    await checkIfTheCardExists(cardId);

    const balance: { 
        balance: number,
        transactions: paymentsRepository.PaymentWithBusinessName[],
        recharges: rechargesRepository.Recharge[]
    } = await calculateBalance(cardId);

    return balance;
}

export async function blockCard(cardInfos: { cardId: number, password: string }) {
    const { cardId, password } = cardInfos;

    const card: cardsRepository.Card = await checkIfTheCardExists(cardId);

    checksThatTheCardIsNotExpired(card);
    
    if(card.isBlocked) throw errorHandlingUtils.blocked("card"); 

    validatePassword(password, card.password);

    const cardUpdated: cardsRepository.CardUpdateData = {
        isBlocked: true
    };
    
    await cardsRepository.update(cardId, cardUpdated);
}

export async function unlockCard(cardInfos: { cardId: number, password: string }) {
    const { cardId, password } = cardInfos;

    const card: cardsRepository.Card = await checkIfTheCardExists(cardId);

    checksThatTheCardIsNotExpired(card);
    
    if(!card.isBlocked) throw errorHandlingUtils.unlocked("Card"); 

    validatePassword(password, card.password);

    const cardUpdated: cardsRepository.CardUpdateData = {
        isBlocked: false
    };
    
    await cardsRepository.update(cardId, cardUpdated);
}