import joi, { Schema } from "joi";

export const recharge: Schema = joi.object({
    cardId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required()
}); 