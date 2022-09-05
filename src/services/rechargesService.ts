import * as cardsService from "./cardsService";
import * as cardsRepository from "../repositories/cardsRepository"; 
import * as rechargesRepository from "../repositories/rechargesRepository";
import * as errorHandlingUtils from "../utils/errorHandlingUtils";

export async function rechargeCard(apiKey: string | undefined, cardInfos: { cardId: number, amount: number }) {
    const { cardId, amount } = cardInfos;
    
    await cardsService.checkIfTheApiKeyIsValid(apiKey);

    const card: cardsRepository.Card = await cardsService.checkIfTheCardExists(cardId);

    if(!card.password) {
        throw errorHandlingUtils.notActivated("Card"); 
    }

    if(card.isBlocked) {
        throw errorHandlingUtils.blocked("card");
    }
    
    cardsService.checksThatTheCardIsNotExpired(card);

    await rechargesRepository.insert({ cardId, amount });
}