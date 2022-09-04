import * as cardsService from "../services/cardsService";
import * as cardRepository from "../repositories/cardRepository"; 
import * as rechargeRepository from "../repositories/rechargeRepository";

export async function rechargeCard(apiKey: string | undefined, cardInfos: { cardId: number, amount: number }) {
    const { cardId, amount } = cardInfos;
    
    await cardsService.checkIfTheApiKeyIsValid(apiKey);

    const card: cardRepository.Card = await cardsService.checkIfTheCardExists(cardId);

    if(!card.password || card.isBlocked) {
        throw { code: "Error_Card_Is_Not_Activated", message: "Card is not activated!" };
    }
    
    cardsService.checksThatTheCardIsNotExpired(card);

    await rechargeRepository.insert({ cardId, amount });
}