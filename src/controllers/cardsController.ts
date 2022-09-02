import { Request, Response } from "express"
import * as cardRepository from "../repositories/cardRepository";
import * as cardsService from "../services/cardsService";

export async function createCard(req: Request, res: Response) {
    const apiKey = req.header("x-api-key");
    const data: { employeeId: number, type: cardRepository.TransactionTypes } = req.body;

    await cardsService.createCard(data, apiKey);
        
    res.status(201).send("Card created successfully!");
}