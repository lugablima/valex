import { CreateCardSchema } from "../../src/types/cardsTypes";
import * as faker from "../helpers/faker";

type OverwriteCardsPayload = Partial<CreateCardSchema>;

export function cardPayloadFactory(overwrite: OverwriteCardsPayload = {}): CreateCardSchema {
	return {
		employeeId: faker.generateRandomNumber({ min: 1 }),
		type: faker.generateRandomTransactionType(),
		...overwrite,
	};
}
