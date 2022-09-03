import Joi from "joi";

export const CardInfoSchema = Joi.object({
    cardType: Joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required(),
    employeeId: Joi.number().required()
})