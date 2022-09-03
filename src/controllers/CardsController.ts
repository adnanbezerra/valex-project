import { Request, Response } from 'express';
import { createNewCard } from '../services/CardsServices.js';

export async function postCard(req: Request, res: Response) {
    const apiKey = req.headers['x-api-key'];
    const cardInfo = req.body;

    await createNewCard(apiKey, cardInfo);

    res.status(201).send('Credit card successfully created');
}