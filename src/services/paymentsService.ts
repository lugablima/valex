import * as cardsService from "./cardsService";
import * as cardsRepository from "../repositories/cardsRepository";
import * as businessRepository from "../repositories/businessRepository"; 
import * as paymentsRepository from "../repositories/paymentsRepository";
import * as errorHandlingUtils from "../utils/errorHandlingUtils";
import * as cardsUtils from "../utils/cardsUtils";
import * as paymentsTypes from "types/paymentsTypes";
import { Card } from "@prisma/client";

async function checkIfItIsAValidBusiness(businessId: number, card: Card) {
	const business = await businessRepository.findById(businessId);

	if (!business) {
        throw errorHandlingUtils.notFound("Business"); 
    }

	if (business.type !== card.type) {
        throw errorHandlingUtils.differentTypes("Card and business"); 
    }
}

async function checkIfTheCardHasEnoughBalance(cardId: number, amount: number) {
    const { balance } = await cardsService.calculateBalance(cardId);

	if (amount > balance) {
        throw errorHandlingUtils.insufficient("balance"); 
    }
}

async function checkCardDetails(number: string, cardholderName: string, expirationDate: string) {
    const card: cardsRepository.Card | undefined = await cardsRepository.findByCardDetails(number, cardholderName, expirationDate);

    if(!card) {
        throw errorHandlingUtils.notFound("Card");
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

export async function payOnlineWithCard(cardInfos: {
    number: string,
    cardholderName: string,
    expirationDate: string,
    cvc: string,
    businessId: number,
    amount: number
}) {
    const {
        number,
        cardholderName,
        expirationDate,
        cvc,
        businessId,
        amount
    } = cardInfos;
    
    const card: cardsRepository.Card = await checkCardDetails(number, cardholderName, expirationDate);

    cardsService.validateCVC(cvc, card.securityCode);

    checkIfTheCardIsActivated(card);
    
    cardsService.checksThatTheCardIsNotExpired(card);

    checkIfTheCardIsBlocked(card);

    await checkIfItIsAValidBusiness(businessId, card);

    await checkIfTheCardHasEnoughBalance(card.id, amount);

    await paymentsRepository.insert({ cardId: card.id, businessId, amount });
}