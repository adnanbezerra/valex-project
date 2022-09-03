import { Request, Response, NextFunction } from "express";
import { findByApiKey } from "../repositories/companyRepository";

export async function ValidateApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) return res.status(422).send("Insert a valid API key!");
    else next();
}