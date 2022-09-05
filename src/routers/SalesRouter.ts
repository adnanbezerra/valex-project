import { Router } from "express";
import { postNewPayment } from "../controllers/SalesController.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { PaymentSchema } from "../schemas/PaymentSchema.js";

export const SalesRouter = Router();

SalesRouter.post('/newSale', validateSchema(PaymentSchema), postNewPayment);