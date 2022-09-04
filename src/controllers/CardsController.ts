import { Request, Response } from 'express';
import { createCardPassword, createNewCard } from '../services/CardsServices.js';

export async function postCard(req: Request, res: Response) {
    const apiKey = req.headers['x-api-key'];
    const cardInfo = req.body;

    const cardCVV = await createNewCard(apiKey, cardInfo);

    console.log('chegou aqui');
    
    res.status(201).send(cardCVV);
}

export async function activateCard(req: Request, res: Response) {
    const cardInfo = req.body;
    await createCardPassword(cardInfo);

    res.sendStatus(201);
}