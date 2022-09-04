import { Router } from "express";
import { activateCard, getBalance, postCard, putBlockCard, putUnblockCard } from "../controllers/CardsController.js";
import { ValidateApiKey } from "../middlewares/ValidateApiKey.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { ActivateCardSchema } from "../schemas/ActivateCardSchema.js";
import { BalanceSchema } from "../schemas/BalanceSchema.js";
import { BlockCardSchema } from "../schemas/BlockCardSchema.js";
import { CardInfoSchema } from "../schemas/CardInfoSchema.js";

export const CardsRouter = Router();

CardsRouter.post('/card', validateSchema(CardInfoSchema), ValidateApiKey, postCard);
CardsRouter.put('/activateCard/:cardId', validateSchema(ActivateCardSchema), activateCard);
CardsRouter.get('/balance', validateSchema(BalanceSchema), getBalance);
CardsRouter.put('/blockCard', validateSchema(BlockCardSchema), putBlockCard);
CardsRouter.put('/unblockCard', validateSchema(BlockCardSchema), putUnblockCard);