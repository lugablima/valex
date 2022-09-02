import joi from "joi";

export const cardSchema = joi.object({
    employeeId: joi.number().integer().positive().required(),
    type: joi.string().valid("groceries", "restaurants", "transport", "education", "health").required()
}); 