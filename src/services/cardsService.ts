import "../setup";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as cardsUtils from "../utils/cardsUtils";

export async function createCard(data: { employeeId: number, type: cardRepository.TransactionTypes }, apiKey: string | undefined) {
    if(!apiKey) {
        throw { code: "Error_Api_Key_Not_Sent", message: "The api key was not sent" };
    }
    
    const company: companyRepository.Company | undefined = await companyRepository.findByApiKey(apiKey); 

    if(!company) {
        throw { code: "Error_Invalid_Api_Key", message: "The api key is invalid" };
    }

    const employee: employeeRepository.Employee | undefined = await employeeRepository.findById(data.employeeId); 

    if(!employee) {
        throw { code: "Error_Invalid_Employee", message: "This employee is not registered" };
    }

    const employeeCards: cardRepository.Card | undefined = await cardRepository.findByTypeAndEmployeeId(data.type, data.employeeId);

    if(employeeCards) {
        throw { code: "Error_Card_Type_Conflict", message: "There is already a card of this type registered for this user" };
    }

    const cardNumber: string = faker.finance.account(16);
    const nameOnCard: string = cardsUtils.generateNameOnCard(employee.fullName);
    const expirationDate: string = dayjs().add(5, "year").format("MM/YY");
    const cvc: string = faker.finance.creditCardCVV();
    
    const encryptedCvc: string = cardsUtils.encryptCvc(cvc);
    
    const card: cardRepository.CardInsertData = {
        number: cardNumber,
        employeeId: data.employeeId,
        cardholderName: nameOnCard,
        securityCode: encryptedCvc,
        expirationDate,
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: true,
        type: data.type
    }

    await cardRepository.insert(card);
}

export async function activateCard(cardInfo: { cardId: number, cvc: string, password: string }) {
    const { cardId, cvc, password } = cardInfo;

    const card: cardRepository.Card | undefined = await cardRepository.findById(cardId);

    if(!card) {
        throw { code: "Error_Invalid_Card_Id", message: "Card id is invalid!" };
    }

    if(dayjs(dayjs().format("MM/YY")).isAfter(card.expirationDate)) {
        throw { code: "Error_Card_Is_Expired", message: "The card is expired!" };
    }

    if(card.password) {
        throw { code: "Error_Card_Already_Activated", message: "The card is already activated!" };
    }

    const decryptedCvc: string = cardsUtils.decryptCvc(card.securityCode);

    if(cvc !== decryptedCvc) {
        throw { code: "Error_Invalid_CVC", message: "CVC is invalid!" };
    }

    const passwordRegex: RegExp = /^[0-9]{4}$/;

    if(!passwordRegex.test(password)) {
        throw { code: "Error_Invalid_Password", message: "The password must consist of 4 numbers!" };
    }

    const saltRounds: number = 10;
    const cryptedPassword: string = bcrypt.hashSync(password, saltRounds);

    const cardUpdated: cardRepository.CardUpdateData = {
        password: cryptedPassword,
        originalCardId: cardId,
        isBlocked: false
    };
    
    await cardRepository.update(cardId, cardUpdated);
}