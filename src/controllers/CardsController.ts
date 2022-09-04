import { Request, Response } from 'express';
import { createCardPassword, createNewCard, generateCardBalance } from '../services/CardsServices.js';

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

export async function getBalance(req: Request, res: Response) {
    const cardId = res.locals.cardId;

    const balance = await generateCardBalance(cardId);

    res.status(200).send(balance);
}