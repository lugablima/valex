import { Card } from "@prisma/client";
import { prisma } from "../../src/config/prisma";
import * as faker from "../helpers/faker";

type OverwriteCardFactoryFields = Partial<Card>;

export default async function cardFactory(overwrite: OverwriteCardFactoryFields = {}) {
	const card = await prisma.card.create({
		data: {
			employeeId: faker.generateRandomNumber({ min: 1 }),
			number: faker.generateCardNumber(),
			cardholderName: faker.generateCardholderName(),
			securityCode: faker.generateSecurityCode(),
			expirationDate: faker.generateExpirationDate(),
			isVirtual: faker.generateRandomBoolean(),
			isBlocked: faker.generateRandomBoolean(),
			type: faker.generateRandomTransactionType(),
			...overwrite,
		},
	});

	return card;
}
