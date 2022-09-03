import { Request, Response } from "express"
import * as cardRepository from "../repositories/cardRepository";
import * as cardsService from "../services/cardsService";

export async function createCard(req: Request, res: Response) {
    const apiKey = req.header("x-api-key");
    const data: { employeeId: number, type: cardRepository.TransactionTypes } = req.body;

    await cardsService.createCard(data, apiKey);
        
    res.status(201).send("Card created successfully!");
}

export async function activateCard(req: Request, res: Response) {
    const cardInfos: { cardId: number, cvc: string, password: string } = req.body;

    await cardsService.activateCard(cardInfos);
        
    res.status(200).send("Card activated successfully!");
}

export async function viewCardBalanceAndTransactions(req: Request, res: Response) {
    const cardId: number = parseInt(req.params.cardId);

    const balance = await cardsService.viewCardBalanceAndTransactions(cardId);
        
    res.status(200).send(balance);
}

export async function blockCard(req: Request, res: Response) {
    const cardInfos: { cardId: number, password: string } = req.body;

    await cardsService.blockCard(cardInfos);
        
    res.status(200).send("Card blocked successfully!");
}

export async function unlockCard(req: Request, res: Response) {
    const cardInfos: { cardId: number, password: string } = req.body;

    await cardsService.unlockCard(cardInfos);
        
    res.status(200).send("Card unlocked successfully!");
}