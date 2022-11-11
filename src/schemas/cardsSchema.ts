import joi from "joi";
import * as cardsTypes from "../types/cardsTypes";

export const create = joi.object<cardsTypes.CreateCardSchema>({
    employeeId: joi.number().integer().positive().required(),
	type: joi.string().valid("groceries", "restaurant", "transport", "education", "health").required(),
}); 

export const activate = joi.object<cardsTypes.ActivateCardSchema>({
    cardId: joi.number().integer().positive().required(),
	cvc: joi.string().trim().length(3).required(),
	password: joi.string().trim().required(),
}); 

export const blockOrUnlock = joi.object<cardsTypes.BlockOrUnlockCardSchema>({
    cardId: joi.number().integer().positive().required(),
	password: joi.string().trim().required(),
}); 

export const virtualCard: Schema = joi.object({
    originalCardId: joi.number().integer().positive().required(),
    originalCardPassword: joi.string().trim().required()
}); 