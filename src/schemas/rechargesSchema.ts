import joi from "joi";
import * as cardsTypes from "../types/rechargesTypes";

export const recharge = joi.object<cardsTypes.RechargeSchema>({
	cardId: joi.number().integer().positive().required(),
	amount: joi.number().integer().positive().required(),
});
