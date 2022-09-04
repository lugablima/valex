import joi, { Schema } from "joi";

export const payment: Schema = joi.object({
    cardId: joi.number().integer().positive().required(),
    password: joi.string().trim().required(),
    businessId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required()
}); 