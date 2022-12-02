import { prisma } from "../../src/config/prisma";

export async function deleteAllData() {
	await prisma.$transaction([
		prisma.$executeRaw`TRUNCATE TABLE businesses RESTART IDENTITY`,
		prisma.$executeRaw`TRUNCATE TABLE cards RESTART IDENTITY`,
		prisma.$executeRaw`TRUNCATE TABLE companies RESTART IDENTITY`,
		prisma.$executeRaw`TRUNCATE TABLE employees RESTART IDENTITY`,
		prisma.$executeRaw`TRUNCATE TABLE payments RESTART IDENTITY`,
		prisma.$executeRaw`TRUNCATE TABLE recharges RESTART IDENTITY`,
	]);
}

export async function disconnectPrisma() {
	await prisma.$disconnect();
}
