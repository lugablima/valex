import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/prisma";

export default async function createEmployee(companyId: number) {
	const employee = await prisma.employee.create({
		data: {
			fullName: faker.name.fullName(),
			cpf: faker.unique.length.toPrecision(11),
			email: faker.internet.email(),
			companyId,
		},
	});

	return employee;
}
