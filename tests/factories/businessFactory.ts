import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/prisma";
import { TransactionType } from "@prisma/client";

export default async function createBusiness(businessType: TransactionType) {
	const business = await prisma.business.create({
		data: {
			name: faker.company.name(),
			type: businessType,
		},
	});

	return business;
}
