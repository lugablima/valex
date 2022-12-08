import { Business, Company, Employee, TransactionType } from "@prisma/client";
import { prisma } from "../../src/config/prisma";
import createBusiness from "./businessFactory";
import createCompany from "./companyFactory";
import createEmployee from "./employeeFactory";

interface IScenarioSeed {
	company: Company;
	employee: Employee;
	businesses: Business[];
}

export async function createScenarioSeed(): Promise<IScenarioSeed> {
	const company = await createCompany();
	const employee = await createEmployee(company.id);
	const businessTypes: TransactionType[] = ["groceries", "restaurant", "transport", "education", "health"];
	const businesses = await Promise.all(businessTypes.map(async (businessType) => await createBusiness(businessType)));

	return {
		company,
		employee,
		businesses,
	};
}

export async function deleteAllData() {
	await prisma.$transaction([
		prisma.$executeRaw`TRUNCATE TABLE businesses RESTART IDENTITY CASCADE`,
		prisma.$executeRaw`TRUNCATE TABLE cards RESTART IDENTITY CASCADE`,
		prisma.$executeRaw`TRUNCATE TABLE companies RESTART IDENTITY CASCADE`,
		prisma.$executeRaw`TRUNCATE TABLE employees RESTART IDENTITY CASCADE`,
		prisma.$executeRaw`TRUNCATE TABLE payments RESTART IDENTITY CASCADE`,
		prisma.$executeRaw`TRUNCATE TABLE recharges RESTART IDENTITY CASCADE`,
	]);
}

export async function disconnectPrisma() {
	await prisma.$disconnect();
}
