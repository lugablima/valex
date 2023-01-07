import { CreateCardSchema, ActivateCardSchema } from "../../src/types/cardsTypes";
import * as faker from "../helpers/faker";
import { decryptCvc } from "../../src/utils/cardsUtils";

type OverwriteCreateCardPayload = Partial<CreateCardSchema>;

type OverwriteActivateCardPayload = Partial<ActivateCardSchema>;

export function create(overwrite: OverwriteCreateCardPayload = {}): CreateCardSchema {
	return {
		employeeId: faker.generateRandomNumber({ min: 1 }),
		type: faker.generateRandomTransactionType(),
		...overwrite,
	};
}

export function activate(overwrite: OverwriteActivateCardPayload = {}): ActivateCardSchema {
	return {
		cardId: faker.generateRandomNumber({ min: 1 }),
		cvc: decryptCvc(faker.generateSecurityCode()),
		password: faker.generateRandomPassword(),
		...overwrite,
	};
}
