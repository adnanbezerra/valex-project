import { Request, Response } from "express";
import { payment } from "../services/SalesServices.js";

export async function postNewPayment(req: Request, res: Response) {
    const paymentInfo = req.body;

    await payment(paymentInfo);

    return res.sendStatus(200);
}