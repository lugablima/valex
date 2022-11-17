import "../setup";
import { faker } from "@faker-js/faker";
import { unsentEntityError, invalidCredentialsError, notFoundError, conflictError } from "../utils/errorHandlingUtils";
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
	if (!apiKey) throw unsentEntityError("API key");

	const company = await companyRepository.findByApiKey(apiKey);

	if (!company) throw invalidCredentialsError("API key");
}

export async function validateCardIdOrFail(cardId: number) {
	const card = await cardsRepository.findById(cardId);

	if (!card) throw notFoundError("Card");

	return card;
}

async function validateEmployeeIdOrFail(employeeId: number) {
	const employee = await employeeRepository.findById(employeeId);

	if (!employee) throw notFoundError("Employee");

	return employee;
}

async function validateConflictCard(type: TransactionType, employeeId: number) {
	const employeeCard = await cardsRepository.findByTypeAndEmployeeId(type, employeeId);

	if (employeeCard) throw conflictError("This type of card already exists associated with this employee!");
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

	if (card.password) throw conflictError("This card is already activated!");

	cardsUtils.validateCVC(cvc, card.securityCode);

	cardsUtils.checkPasswordFormat(password);

	await cardsRepository.update(cardId, { password: cardsUtils.encryptPassword(password) });
}

export async function viewBalanceAndTransactions(cardId: number | undefined) {
	if (!cardId) throw unsentEntityError("Card id");

	await validateCardIdOrFail(cardId);

	const balance = await calculateBalance(cardId);

	return balance;
}

export async function block({ cardId, password }: cardsTypes.BlockOrUnlockCardSchema) {
	const card = await validateCardIdOrFail(cardId);

	cardsUtils.checksThatTheCardIsNotExpired(card.expirationDate);

	if (card.isBlocked) throw conflictError("This card is already blocked!");

	cardsUtils.validatePassword(password, card.password);

	await cardsRepository.update(cardId, { isBlocked: true });
}

export async function unlock({ cardId, password }: cardsTypes.BlockOrUnlockCardSchema) {
	const card = await validateCardIdOrFail(cardId);

	cardsUtils.checksThatTheCardIsNotExpired(card.expirationDate);

	if (!card.isBlocked) throw conflictError("This card is already unlocked!");

	cardsUtils.validatePassword(password, card.password);

	await cardsRepository.update(cardId, { isBlocked: false });
}

export async function createVirtual({
	originalCardId,
	originalCardPassword,
}: cardsTypes.CreateVirtualCardSchema): Promise<Card> {
	const card = await validateCardIdOrFail(originalCardId);

	cardsUtils.validatePassword(originalCardPassword, card.password);

	const cardData = cardsUtils.generateCardInfos("John Doe", card.employeeId, card.type);

	const virtualCard: cardsTypes.CreateCardData = {
		...cardData,
		cardholderName: card.cardholderName,
		password: card.password,
		number: faker.finance.creditCardNumber("mastercard").replaceAll("-", ""),
		isVirtual: true,
		originalCardId,
	};

	const createdVirtualCard = await cardsRepository.insert(virtualCard);

	return {
		...createdVirtualCard,
		securityCode: cardsUtils.decryptCvc(createdVirtualCard.securityCode),
		password: originalCardPassword,
	};
}
