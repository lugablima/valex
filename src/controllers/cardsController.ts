import { Request, Response } from "express";
import * as cardsRepository from "../repositories/cardsRepository";
import * as cardsService from "../services/cardsService";

export async function createCard(req: Request, res: Response) {
    const apiKey = req.header("x-api-key");
    const data: { employeeId: number, type: cardsRepository.TransactionTypes } = req.body;

    const card = await cardsService.createCard(data, apiKey);
        
    res.status(201).send(card);
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

export async function createVirtualCard(req: Request, res: Response) {
    const cardInfos: { originalCardId: number, originalCardPassword: string } = req.body;

    const virtualCard = await cardsService.createVirtualCard(cardInfos);
        
    res.status(201).send(virtualCard);
}