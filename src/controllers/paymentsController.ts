import { Request, Response } from "express";
import * as paymentsServices from "../services/paymentsServices";

export async function payWithCard(req: Request, res: Response) {
    const cardInfos: { cardId: number, password: string, businessId: number, amount: number } = req.body;

    await paymentsServices.payWithCard(cardInfos);
        
    res.status(201).send("Purchase made successfully!");
}