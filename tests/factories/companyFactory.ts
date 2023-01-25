import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/prisma";

export default async function createCompany() {
	const company = await prisma.company.create({
		data: {
			name: faker.company.name(),
			apiKey: "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0",
		},
	});

	return company;
}
