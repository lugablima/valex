import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { TransactionType } from "@prisma/client";
import { encryptCvc } from "../../src/utils/cardsUtils";

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
	return encryptCvc(faker.finance.creditCardCVV());
}

export function generateExpirationDate() {
	return dayjs().add(5, "year").format("MM/YY");
}

export function generateRandomBoolean() {
	return faker.datatype.boolean();
}

export function generateRandomPassword(numberOfDigits?: number) {
	return faker.finance.pin(numberOfDigits);
}
