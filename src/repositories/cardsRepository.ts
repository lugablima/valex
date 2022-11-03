import { prisma } from "../config/prisma";
// import { mapObjectToUpdateQuery } from "../utils/sqlUtils";

export type TransactionTypes =
	| "groceries"
	| "restaurant"
	| "transport"
	| "education"
	| "health";

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
	const result = await prisma.card.findMany({ orderBy: { id: "asc" } });
	return result;
}

export async function findById(id: number) {
	const result = await prisma.card.findUnique({ where: { id } });

	return result;
}

export async function findByTypeAndEmployeeId(
	type: TransactionTypes,
	employeeId: number
) {
	const result = await prisma.card.findFirst({
		where: {
			AND: [{ type }, { employeeId }],
		},
	});

	return result;
}

export async function findByCardDetails(
	number: string,
	cardholderName: string,
	expirationDate: string
) {
	const result = await prisma.card.findFirst({
		where: {
			AND: [{ number }, { cardholderName }, { expirationDate }],
		},
	});

	return result;
}

export async function insert(cardData: CardInsertData) {
	const {
		employeeId,
		number,
		cardholderName,
		securityCode,
		expirationDate,
		password,
		isVirtual,
		originalCardId,
		isBlocked,
		type,
	} = cardData;

	const result = await prisma.card.create({
		data: {
			employeeId,
			number,
			cardholderName,
			securityCode,
			expirationDate,
			password,
			isVirtual,
			originalCardId,
			isBlocked,
			type,
		},
	});

	return result;
}

export async function update(id: number, cardData: CardUpdateData) {
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
