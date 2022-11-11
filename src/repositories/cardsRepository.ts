import { prisma } from "../config/prisma";
import * as cardsTypes from "../types/cardsTypes";
// import { mapObjectToUpdateQuery } from "../utils/sqlUtils";

export type TransactionTypes = "groceries" | "restaurant" | "transport" | "education" | "health";

export interface Card {
	id: number;
	employeeId: number;
	number: string;
	cardholderName: string;
	securityCode: string;
	expirationDate: string;
	password?: string;
	isVirtual: boolean;
	originalCardId?: number;
	isBlocked: boolean;
	type: TransactionTypes;
}

export type CardInsertData = Omit<Card, "id">;
export type CardUpdateData = Partial<Card>;

export async function find() {
	return prisma.card.findMany({ orderBy: { id: "asc" } });
}

export async function findById(id: number) {
	return prisma.card.findUnique({ where: { id } });
}

export async function findByTypeAndEmployeeId(type: TransactionTypes, employeeId: number) {
	return prisma.card.findFirst({
		where: {
			AND: [{ type }, { employeeId }],
		},
	});
}

export async function findByCardDetails(number: string, cardholderName: string, expirationDate: string) {
	return prisma.card.findFirst({
		where: {
			AND: [{ number }, { cardholderName }, { expirationDate }],
		},
	});
}

export async function insert(cardData: cardsTypes.CreateCardData) {
	return prisma.card.create({ data: cardData });
}

export async function update(id: number, cardData: cardsTypes.UpdateCardData) {
	await prisma.card.update({
		where: { id },
		data: cardData,
	});
}

// export async function update(id: number, cardData: CardUpdateData) {
// 	const { objectColumns: cardColumns, objectValues: cardValues } =
// 		mapObjectToUpdateQuery({
// 			object: cardData,
// 			offset: 2,
// 		});

// 	prisma.query(
// 		`
//     UPDATE cards
//       SET ${cardColumns}
//     WHERE $1=id
//   `,
// 		[id, ...cardValues]
// 	);
// }

export async function remove(id: number) {
	await prisma.card.delete({
		where: { id },
	});
}
