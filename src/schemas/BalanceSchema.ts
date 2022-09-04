import Joi from "joi";

export const BalanceSchema = Joi.object({
    cardNumber: Joi.string().trim().required()
})