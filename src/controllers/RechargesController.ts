import { Request, Response } from "express";
import { rechargeService } from "../services/RechargesServices.js";

export async function rechargeCard(req: Request, res: Response) {
    const apiKey = req.headers['x-api-key'];
    const cardInfo = req.body;

    await rechargeService(apiKey, cardInfo);

    res.sendStatus(200);
}