import { Request, Response } from "express";
import * as rechargesServices from "../services/rechargesServices";

export async function rechargeCard(req: Request, res: Response) {
    const apiKey: string | undefined = req.header("x-api-key");
    const cardInfos: { cardId: number, amount: number } = req.body;

    await rechargesServices.rechargeCard(apiKey, cardInfos);
        
    res.status(201).send("Card recharged successfully!");
}
