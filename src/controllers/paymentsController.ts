import { Request, Response } from "express";
import * as paymentsService from "../services/paymentsService";

export async function pay(req: Request, res: Response) {
	await paymentsService.pay(req.body);

	res.status(200).send("Purchase made successfully!");
}

export async function payOnline(req: Request, res: Response) {
	await paymentsService.payOnline(req.body);

	res.status(200).send("Successful online purchase!");
}
