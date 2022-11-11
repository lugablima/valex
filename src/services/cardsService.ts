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
import * as cardsTypes from "../types/cardsTypes";
import { Card, TransactionType } from "@prisma/client";

export async function calculateBalance(cardId: number): Promise<cardsTypes.BalanceCard> {
	const transactions = await paymentsRepository.findAllByCardId(cardId);
	const recharges = await rechargesRepository.findAllByCardId(cardId);
    
    const totalTransactions: number = cardsUtils.calculateTotalAmount(transactions);
    const totalRecharges: number = cardsUtils.calculateTotalAmount(recharges);
     
    let balance = totalRecharges - totalTransactions;
     
	if (balance < 0) balance = 0;

    return { balance, transactions, recharges };
}

export async function validateApiKeyOrFail(apiKey: string | undefined) {
	if (!apiKey) throw errorHandlingUtils.notSend("API key");
    
	const company = await companyRepository.findByApiKey(apiKey);

	if (!company) throw errorHandlingUtils.invalid("API key");
}

export async function validateCardIdOrFail(cardId: number) {
	const card = await cardsRepository.findById(cardId);

	if (!card) throw errorHandlingUtils.notFound("Card");

    return card;
}

async function validateEmployeeIdOrFail(employeeId: number) {
	const employee = await employeeRepository.findById(employeeId);
 
	if (!employee) throw errorHandlingUtils.notFound("Employee");

	return employee;
}

async function validateConflictCard(type: TransactionType, employeeId: number) {
	const employeeCard = await cardsRepository.findByTypeAndEmployeeId(type, employeeId);

	if (employeeCard) throw errorHandlingUtils.typeConflict("Card");
    }

export async function create(
	{ employeeId, type }: cardsTypes.CreateCardSchema,
	apiKey: string | undefined
): Promise<Card> {
	await validateApiKeyOrFail(apiKey);

	const employee = await validateEmployeeIdOrFail(employeeId);

	await validateConflictCard(type, employeeId);

	const cardData = cardsUtils.generateCardInfos(employee.fullName, employeeId, type);

	const createdCard = await cardsRepository.insert(cardData);

	return { ...createdCard, securityCode: cardsUtils.decryptCvc(createdCard.securityCode) };
    }

export async function activate({ cardId, cvc, password }: cardsTypes.ActivateCardSchema) {
	const card = await validateCardIdOrFail(cardId);

	cardsUtils.checksThatTheCardIsNotExpired(card.expirationDate);

	if (card.password) throw errorHandlingUtils.activated("card");

	cardsUtils.validateCVC(cvc, card.securityCode);

	cardsUtils.checkPasswordFormat(password);

	await cardsRepository.update(cardId, { password: cardsUtils.encryptPassword(password) });
}

export async function viewBalanceAndTransactions(cardId: number | undefined) {
	if (!cardId) throw errorHandlingUtils.notSend("Card id");

	await validateCardIdOrFail(cardId);

	const balance = await calculateBalance(cardId);

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

export async function createVirtualCard(cardInfos: { originalCardId: number, originalCardPassword: string }) {
    const { originalCardId, originalCardPassword } = cardInfos;

    const card: cardsRepository.Card = await checkIfTheCardExists(originalCardId);

    validatePassword(originalCardPassword, card.password);
 
    const cardNumber: string = faker.finance.creditCardNumber("mastercard");
    const expirationDate: string = dayjs().add(5, "year").format("MM/YY");
    const cvc: string = faker.finance.creditCardCVV();
    
    const encryptedCvc: string = cardsUtils.encryptCvc(cvc);
    
    const virtualCard: cardsRepository.CardInsertData = {
        number: cardNumber,
        employeeId: card.employeeId,
        cardholderName: card.cardholderName,
        securityCode: encryptedCvc,
        expirationDate,
        password: card.password,
        isVirtual: true,
        originalCardId,
        isBlocked: false,
        type: card.type
    }

    const { id } = await cardsRepository.insert(virtualCard);

    return {
        id, 
        number: cardNumber,
        employeeId: card.employeeId,
        cardholderName: card.cardholderName,
        securityCode: cvc,
        expirationDate,
        isVirtual: true,
        originalCardId,
        isBlocked: false,
        type: card.type
    }
}