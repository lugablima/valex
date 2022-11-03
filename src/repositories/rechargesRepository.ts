import { prisma } from "../config/prisma";

export interface Recharge {
	id: number;
	cardId: number;
	timestamp: Date;
	amount: number;
}
export type RechargeInsertData = Omit<Recharge, "id" | "timestamp">;

export async function findByCardId(cardId: number) {
	const result = await prisma.recharge.findFirst({
		where: {
			cardId,
		},
	});

	return result;
}

export async function insert(rechargeData: RechargeInsertData) {
	await prisma.recharge.create({
		data: rechargeData,
	});
}
