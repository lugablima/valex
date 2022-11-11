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
