import * as cardsService from "../services/cardsService";
import * as cardRepository from "../repositories/cardRepository";
import * as businessRepository from "../repositories/businessRepository"; 
import * as paymentRepository from "../repositories/paymentRepository";

async function checkIfItIsAValidBusiness(businessId: number, card: cardRepository.Card) {
    const business: businessRepository.Business | undefined = await businessRepository.findById(businessId) 

    if(!business) {
        throw { code: "Error_Invalid_Business", message: "Invalid business id!" };
    }

    if(business.type !== card.type) {
        throw { code: "Error_Invalid_Business", message: "Card and business are of different types!" };
    }
}

async function checkIfTheCardHasEnoughBalance(cardId: number, amount: number) {
    const { balance } = await cardsService.calculateBalance(cardId);

    if(amount > balance) {
        throw { code: "Error_Insufficient_Balance", message: "The card balance is insufficient for this purchase!" };
    }
}

export async function payWithCard(cardInfos: { cardId: number, password: string, businessId: number, amount: number }) {
    const { cardId, password, businessId, amount } = cardInfos;
    
    const card: cardRepository.Card = await cardsService.checkIfTheCardExists(cardId);

    if(!card.password) {
        throw { code: "Error_Card_Is_Not_Activated", message: "Card is not activated!" };
    }
    
    cardsService.checksThatTheCardIsNotExpired(card);

    if(card.isBlocked) {
        throw { code: "Error_Blocked_Card", message: "The card is blocked!" };
    }

    cardsService.validatePassword(password, card.password);

    await checkIfItIsAValidBusiness(businessId, card);

    await checkIfTheCardHasEnoughBalance(cardId, amount);

    await paymentRepository.insert({ cardId, businessId, amount });
}