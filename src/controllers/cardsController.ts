import { Request, Response } from "express";
import * as cardsService from "../services/cardsService";

export async function create(req: Request, res: Response) {
	const apiKey = req.header("x-api-key");

	const card = await cardsService.create(req.body, apiKey);

	res.status(201).send(card);
}

export async function activate(req: Request, res: Response) {
	await cardsService.activate(req.body);

	res.status(200).send("Card activated successfully!");
}

export async function viewBalanceAndTransactions(req: Request, res: Response) {
	const cardId: number = parseInt(req.params.cardId);

	const balanceAndTransactions = await cardsService.viewBalanceAndTransactions(cardId);

	res.status(200).send(balanceAndTransactions);
}

export async function block(req: Request, res: Response) {
	await cardsService.block(req.body);

	res.status(200).send("Card blocked successfully!");
}

export async function unlock(req: Request, res: Response) {
	await cardsService.unlock(req.body);

	res.status(200).send("Card unlocked successfully!");
}

export async function createVirtual(req: Request, res: Response) {
	const virtualCard = await cardsService.createVirtual(req.body);

	res.status(201).send(virtualCard);
}
