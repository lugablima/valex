import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { TransactionType, Card } from "@prisma/client";
import * as errorHandlingUtils from "./errorHandlingUtils";
import { CreateCardData } from "types/cardsTypes";

export function generateCardName(fullName: string): string {
	const arrayOfTheName: string[] = fullName.toUpperCase().split(" ");

	if (arrayOfTheName.length === 1) return arrayOfTheName[0];

	let cardName: string = arrayOfTheName[0];

	for (let i = 1; i < arrayOfTheName.length - 1; i++) {
		const middleName: string = arrayOfTheName[i];

		if (middleName.length >= 3) {
			cardName += " " + middleName[0];
		}
	}

	cardName += " " + arrayOfTheName[arrayOfTheName.length - 1];

	return cardName;
}

export function configureCryptr(): Cryptr {
	const cvcSecretKey = process.env.CVC_SECRET_KEY as string;
	return new Cryptr(cvcSecretKey);
}

export function encryptCvc(cvc: string): string {
	const cryptr: Cryptr = configureCryptr();
	return cryptr.encrypt(cvc);
}

export function decryptCvc(encryptedCvc: string): string {
	const cryptr: Cryptr = configureCryptr();
	return cryptr.decrypt(encryptedCvc);
}

export function generateCardInfos(employeeFullName: string, employeeId: number, type: TransactionType): CreateCardData {
	const cvc = faker.finance.creditCardCVV();
	const encryptedCvc = encryptCvc(cvc);

	return {
		number: faker.finance.account(16),
		employeeId,
		cardholderName: generateCardName(employeeFullName),
		securityCode: encryptedCvc,
		expirationDate: dayjs().add(5, "year").format("MM/YY"),
		password: null,
		isVirtual: false,
		originalCardId: null,
		isBlocked: false,
		type,
	};
}

export function calculateTotalAmount(array: any[]): number {
	if (!array.length) return 0;

	return array.reduce((prev, curr) => prev + curr.amount, 0);
}

export function checksThatTheCardIsNotExpired(expirationDate: string) {
	if (dayjs(dayjs().format("MM/YY")).isAfter(expirationDate)) {
		throw errorHandlingUtils.expired("card");
	}
}

export function checkPasswordFormat(password: string) {
	const passwordRegex: RegExp = /^[0-9]{4}$/;

	if (!passwordRegex.test(password)) {
		throw errorHandlingUtils.invalid("password format");
	}
}

export function validatePassword(password: string, encryptedPassword: string | null) {
	checkPasswordFormat(password);

	if (!encryptedPassword) {
		throw errorHandlingUtils.notActivated("Card");
	}

	if (!bcrypt.compareSync(password, encryptedPassword)) {
		throw errorHandlingUtils.invalid("password");
	}
}

export function encryptPassword(password: string) {
	const saltRounds: number = 10;
	return bcrypt.hashSync(password, saltRounds);
}

export function validateCVC(cvc: string, encryptedCvc: string) {
	const decryptedCvc: string = decryptCvc(encryptedCvc);

	if (cvc !== decryptedCvc) throw errorHandlingUtils.invalid("CVC");
}

export function checkIfTheCardIsActivated(card: Card) {
	if (!card.password) {
		throw errorHandlingUtils.notActivated("Card");
	}
}

export function checkIfTheCardIsBlocked(card: Card) {
	if (card.isBlocked) {
		throw errorHandlingUtils.blocked("card");
	}
}
