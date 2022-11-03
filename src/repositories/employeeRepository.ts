import { prisma } from "../config/prisma";

export interface Employee {
	id: number;
	fullName: string;
	cpf: string;
	email: string;
	companyId: number;
}

export async function findById(id: number) {
	const result = await prisma.employee.findUnique({
		where: {
			id,
		},
	});

	return result;
}
