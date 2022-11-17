import * as cardsService from "./cardsService";
import * as cardsRepository from "../repositories/cardsRepository";
import * as businessRepository from "../repositories/businessRepository";
import * as paymentsRepository from "../repositories/paymentsRepository";
import { notFoundError, unauthorizedError } from "../utils/errorHandlingUtils";
import * as cardsUtils from "../utils/cardsUtils";
import * as paymentsTypes from "types/paymentsTypes";
import { Card } from "@prisma/client";

async function checkIfItIsAValidBusiness(businessId: number, card: Card) {
	const business = await businessRepository.findById(businessId);

	if (!business) {
		throw notFoundError("Business");
	}

	if (business.type !== card.type) {
		throw unauthorizedError("Card and business are of different types!");
	}
}

async function checkIfTheCardHasEnoughBalance(cardId: number, amount: number) {
	const { balance } = await cardsService.calculateBalance(cardId);

	if (amount > balance) {
		throw unauthorizedError("Insufficient balance!");
	}
}

async function checkCardDetails(number: string, cardholderName: string, expirationDate: string) {
	const card = await cardsRepository.findByCardDetails(number, cardholderName, expirationDate);

	if (!card) {
		throw notFoundError("Card");
	}

	return card;
}

export async function pay({ cardId, password, businessId, amount }: paymentsTypes.PaymentSchema) {
	const card = await cardsService.validateCardIdOrFail(cardId);

	cardsUtils.checkIfTheCardIsActivated(card);

	cardsUtils.checksThatTheCardIsNotExpired(card.expirationDate);

	cardsUtils.checkIfTheCardIsBlocked(card);

	cardsUtils.validatePassword(password, card.password);

	await checkIfItIsAValidBusiness(businessId, card);

	await checkIfTheCardHasEnoughBalance(cardId, amount);

	await paymentsRepository.insert({ cardId, businessId, amount });
}

export async function payOnline({
	number,
	cardholderName,
	expirationDate,
	cvc,
	businessId,
	amount,
}: paymentsTypes.OnlinePaymentSchema) {
	const card = await checkCardDetails(number, cardholderName, expirationDate);

	cardsUtils.validateCVC(cvc, card.securityCode);

	cardsUtils.checkIfTheCardIsActivated(card);

	cardsUtils.checksThatTheCardIsNotExpired(card.expirationDate);

	cardsUtils.checkIfTheCardIsBlocked(card);

	await checkIfItIsAValidBusiness(businessId, card);

	await checkIfTheCardHasEnoughBalance(card.id, amount);

	await paymentsRepository.insert({ cardId: card.id, businessId, amount });
}
