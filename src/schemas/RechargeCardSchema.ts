import Joi from "joi";

export const RechargeCardSchema = Joi.object({
    cardNumber: Joi.string().trim().required(),
    amount: Joi.number().min(1).required()
})