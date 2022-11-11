import joi from "joi";
import * as paymentsTypes from "../types/paymentsTypes";

export const payment = joi.object<paymentsTypes.PaymentSchema>({
    cardId: joi.number().integer().positive().required(),
    password: joi.string().trim().required(),
    businessId: joi.number().integer().positive().required(),
	amount: joi.number().integer().positive().required(),
}); 

export const onlinePayment: Schema = joi.object({
    number: joi.string().trim().required(),
    cardholderName: joi.string().trim().required(),
    expirationDate: joi.string().trim().required(),
    cvc: joi.string().trim().required(),
    businessId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required()
}); 