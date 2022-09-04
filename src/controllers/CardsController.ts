import { Request, Response } from 'express';
import { blockCard, createCardPassword, createNewCard, generateCardBalance, unblockCard } from '../services/CardsServices.js';

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
    const { cardNumber } = req.body;

    const balance = await generateCardBalance(cardNumber);

    res.status(200).send(balance);
}

export async function putBlockCard(req: Request, res: Response) {
    const { cardNumber, password } = req.body;

    await blockCard(cardNumber, password);

    res.sendStatus(200);
}

export async function putUnblockCard(req: Request, res: Response) {
    const { cardNumber, password } = req.body;

    await unblockCard(cardNumber, password);

    res.sendStatus(200);
}