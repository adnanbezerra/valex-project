import { Request, Response } from 'express';
import { createNewCard } from '../services/CardsServices.js';

export async function postCard(req: Request, res: Response) {
    const apiKey = req.headers['x-api-key'];
    const cardInfo = req.body;

    const cardCVV = await createNewCard(apiKey, cardInfo);

    console.log('chegou aqui');
    
    res.status(201).send(cardCVV);
}