import Joi from "joi";

export const CardInfoSchema = Joi.object({
    cardType: Joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required(),
    employeeId: Joi.number().required()
})