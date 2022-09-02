import joi, { Schema } from "joi";

export const card: Schema = joi.object({
    employeeId: joi.number().integer().positive().required(),
    type: joi.string().valid("groceries", "restaurant", "transport", "education", "health").required()
}); 

export const cardActivation: Schema = joi.object({
    cardId: joi.number().integer().positive().required(),
    cvc: joi.string().trim().min(3).max(3).required(),
    password: joi.string().trim().required()
}); 