import { prisma } from "../config/prisma";

export interface Recharge {
	id: number;
	cardId: number;
	timestamp: Date;
	amount: number;
}
export type RechargeInsertData = Omit<Recharge, "id" | "timestamp">;

export async function findAllByCardId(cardId: number) {
	return prisma.recharge.findMany({
		where: {
			cardId,
		},
		orderBy: { timestamp: "asc" },
	});
}

export async function insert(rechargeData: RechargeInsertData) {
	await prisma.recharge.create({
		data: rechargeData,
	});
}
