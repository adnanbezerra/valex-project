import Joi from "joi";

export const BlockCardSchema = Joi.object({
    cardNumber: Joi.string().trim().required(),
    password: Joi.string().trim().required()
})