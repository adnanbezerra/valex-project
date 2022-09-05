import Joi from "joi";

export const PaymentSchema = Joi.object({
    amount: Joi.number().min(1).required(),
    cardNumber: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    businessId: Joi.number().required()
})