import { Router } from "express";
import { rechargeCard } from "../controllers/RechargesController.js";
import { ValidateApiKey } from "../middlewares/ValidateApiKey.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { RechargeCardSchema } from "../schemas/RechargeCardSchema.js";

export const RechargesRouter = Router();

RechargesRouter.post('/rechargeCard', validateSchema(RechargeCardSchema), ValidateApiKey, rechargeCard);