import * as cardsService from "../services/cardsService";
import * as cardRepository from "../repositories/cardRepository"; 
import * as rechargeRepository from "../repositories/rechargeRepository";
import * as errorHandlingUtils from "../utils/errorHandlingUtils";

export async function rechargeCard(apiKey: string | undefined, cardInfos: { cardId: number, amount: number }) {
    const { cardId, amount } = cardInfos;
    
    await cardsService.checkIfTheApiKeyIsValid(apiKey);

    const card: cardRepository.Card = await cardsService.checkIfTheCardExists(cardId);

    if(!card.password) {
        throw errorHandlingUtils.notActivated("Card"); 
    }

    if(card.isBlocked) {
        throw errorHandlingUtils.blocked("card");
    }
    
    cardsService.checksThatTheCardIsNotExpired(card);

    await rechargeRepository.insert({ cardId, amount });
}