import { Router } from "express";
import { postCard } from "../controllers/CardsController.js";
import { ValidateApiKey } from "../middlewares/ValidateApiKey.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { CardInfoSchema } from "../schemas/CardInfoSchema.js";

export const CardsRouter = Router();

CardsRouter.post('/card', validateSchema(CardInfoSchema), ValidateApiKey, postCard);
CardsRouter.put('/activateCard/:cardId');
CardsRouter.get('/balance');
CardsRouter.put('/blockCard');
CardsRouter.put('/unblockCard');