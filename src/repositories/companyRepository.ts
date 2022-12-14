import { prisma } from "../config/prisma";

export interface Company {
	id: number;
	name: string;
	apiKey?: string;
}

export async function findByApiKey(apiKey: string) {
	return prisma.company.findFirst({
		where: { apiKey },
	});
}
