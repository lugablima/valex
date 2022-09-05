import * as cardsService from "../services/cardsService";
import * as cardRepository from "../repositories/cardRepository";
import * as businessRepository from "../repositories/businessRepository"; 
import * as paymentRepository from "../repositories/paymentRepository";
import * as errorHandlingUtils from "../utils/errorHandlingUtils";

async function checkIfItIsAValidBusiness(businessId: number, card: cardRepository.Card) {
    const business: businessRepository.Business | undefined = await businessRepository.findById(businessId) 

    if(!business) {
        throw errorHandlingUtils.notFound("Business"); 
    }

    if(business.type !== card.type) {
        throw errorHandlingUtils.differentTypes("Card and business"); 
    }
}

async function checkIfTheCardHasEnoughBalance(cardId: number, amount: number) {
    const { balance } = await cardsService.calculateBalance(cardId);

    if(amount > balance) {
        throw errorHandlingUtils.insufficient("balance"); 
    }
}

export async function payWithCard(cardInfos: { cardId: number, password: string, businessId: number, amount: number }) {
    const { cardId, password, businessId, amount } = cardInfos;
    
    const card: cardRepository.Card = await cardsService.checkIfTheCardExists(cardId);

    if(!card.password) {
        throw errorHandlingUtils.notActivated("Card"); 
    }
    
    cardsService.checksThatTheCardIsNotExpired(card);

    if(card.isBlocked) {
        throw errorHandlingUtils.blocked("card"); 
    }

    cardsService.validatePassword(password, card.password);

    await checkIfItIsAValidBusiness(businessId, card);

    await checkIfTheCardHasEnoughBalance(cardId, amount);

    await paymentRepository.insert({ cardId, businessId, amount });
}