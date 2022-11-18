import * as cardsService from "./cardsService";
import * as rechargesRepository from "../repositories/rechargesRepository";
import { unauthorizedError } from "../utils/errorHandlingUtils";
import * as cardsUtils from "../utils/cardsUtils";
import * as cardsTypes from "types/rechargesTypes";

export async function recharge(apiKey: string | undefined, { cardId, amount }: cardsTypes.RechargeSchema) {
	await cardsService.validateApiKeyOrFail(apiKey);

	const card = await cardsService.validateCardIdOrFail(cardId);

	if (!card.password) {
		throw unauthorizedError("The card is inactive!");
	}

	if (card.isBlocked) {
		throw unauthorizedError("The card is blocked!");
	}

	cardsUtils.checksThatTheCardIsNotExpired(card.expirationDate);

	await rechargesRepository.insert({ cardId, amount });
}
