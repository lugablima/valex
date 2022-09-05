import { Request, Response } from "express";
import * as paymentsService from "../services/paymentsService";

export async function payWithCard(req: Request, res: Response) {
    const cardInfos: { cardId: number, password: string, businessId: number, amount: number } = req.body;

    await paymentsService.payWithCard(cardInfos);
        
    res.status(200).send("Purchase made successfully!");
}

export async function payOnlineWithCard(req: Request, res: Response) {
    const cardInfos: {
        number: string,
        cardholderName: string,
        expirationDate: string,
        cvc: string,
        businessId: number,
        amount: number
    } = req.body;

    await paymentsService.payOnlineWithCard(cardInfos);
        
    res.status(200).send("Successful online purchase!");
}