import { faker } from "@faker-js/faker";
import { TransactionType } from "@prisma/client";

interface RandomNumberOptions {
	min?: number;
	max?: number;
	precision?: number;
}

export function generateRandomNumber(options?: RandomNumberOptions): number {
	return faker.datatype.number({ ...options });
}

export function generateRandomTransactionType(): TransactionType {
	return faker.helpers.arrayElement(["groceries", "restaurant", "transport", "education", "health"]);
}

export function generateCardNumber() {
	return faker.finance.creditCardNumber();
}

export function generateCardholderName() {
	return faker.finance.accountName();
}

export function generateSecurityCode() {
	return faker.finance.creditCardCVV();
}

export function generateExpirationDate() {
	return faker.date.future(5).toString();
	// Lembrar de aplicar o dayjs
}

export function generateRandomBoolean() {
	return faker.datatype.boolean();
}
