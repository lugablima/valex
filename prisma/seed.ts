import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.$transaction([
		prisma.company.upsert({
			where: {
				name: "Driven",
			},
			update: {},
			create: {
				id: 1,
				name: "Driven",
				apiKey: "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0",
			},
		}),
		prisma.employee.createMany({
			data: [
				{
					id: 1,
					fullName: "Fulano Rubens da Silva",
					cpf: "47100935741",
					email: "fulano.silva@gmail.com",
					companyId: 1,
				},
				{
					id: 2,
					fullName: "Ciclana Maria Madeira",
					cpf: "08434681895",
					email: "ciclaninha@gmail.com",
					companyId: 1,
				},
			],
			skipDuplicates: true,
		}),
		prisma.business.createMany({
			data: [
				{
					id: 1,
					name: "Responde Aí",
					type: "education",
				},
				{
					id: 2,
					name: "Extra",
					type: "groceries",
				},
				{
					id: 3,
					name: "Driven Eats",
					type: "restaurant",
				},
				{
					id: 4,
					name: "Uber",
					type: "transport",
				},
				{
					id: 5,
					name: "Unimed",
					type: "health",
				},
			],
			skipDuplicates: true,
		}),
	]);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
