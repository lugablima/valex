import joi, { Schema } from "joi";

export const payment: Schema = joi.object({
    cardId: joi.number().integer().positive().required(),
    password: joi.string().trim().required(),
    businessId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required()
}); 

export const onlinePayment: Schema = joi.object({
    number: joi.string().trim().required(),
    cardholderName: joi.string().trim().required(),
    expirationDate: joi.string().trim().required(),
    cvc: joi.string().trim().required(),
    businessId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required()
}); 