import { prisma } from "../config/prisma";
import { TransactionTypes } from "./cardsRepository";

export interface Business {
	id: number;
	name: string;
	type: TransactionTypes;
}

export async function findById(id: number): Promise<Business | null> {
	return prisma.business.findUnique({ where: { id } });
}
