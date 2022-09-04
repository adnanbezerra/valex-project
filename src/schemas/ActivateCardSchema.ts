import Joi from "joi";

export const ActivateCardSchema = Joi.object({
  CVC: Joi.string().required(),
  cardIdentifier: Joi.string().required(),
  newPassword: Joi.string().length(4).required()  
})