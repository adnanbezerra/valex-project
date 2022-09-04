import { Router } from "express";
import { activateCard, getBalance, postCard } from "../controllers/CardsController.js";
import { ValidateApiKey } from "../middlewares/ValidateApiKey.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { ActivateCardSchema } from "../schemas/ActivateCardSchema.js";
import { BalanceSchema } from "../schemas/BalanceSchema.js";
import { CardInfoSchema } from "../schemas/CardInfoSchema.js";

export const CardsRouter = Router();

CardsRouter.post('/card', validateSchema(CardInfoSchema), ValidateApiKey, postCard);
CardsRouter.put('/activateCard/:cardId', validateSchema(ActivateCardSchema), activateCard);
CardsRouter.get('/balance', validateSchema(BalanceSchema), getBalance);
CardsRouter.put('/blockCard');
CardsRouter.put('/unblockCard');