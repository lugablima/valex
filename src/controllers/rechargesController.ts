import { Request, Response } from "express";
import * as rechargesService from "../services/rechargesService";

export async function rechargeCard(req: Request, res: Response) {
    const apiKey: string | undefined = req.header("x-api-key");
    const cardInfos: { cardId: number, amount: number } = req.body;

    await rechargesService.rechargeCard(apiKey, cardInfos);
        
    res.status(200).send("Card recharged successfully!");
}
