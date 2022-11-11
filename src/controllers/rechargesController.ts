import { Request, Response } from "express";
import * as rechargesService from "../services/rechargesService";

export async function recharge(req: Request, res: Response) {
	const apiKey: string | undefined = req.header("x-api-key");

	await rechargesService.recharge(apiKey, req.body);

	res.status(200).send("Card recharged successfully!");
}
