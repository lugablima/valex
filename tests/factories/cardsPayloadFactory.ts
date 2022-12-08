import { faker } from "@faker-js/faker";
import { CreateCardSchema } from "../../src/types/cardsTypes";

export function validPayload(employeeId: number): CreateCardSchema {
	return {
		employeeId,
		type: faker.helpers.arrayElement(["groceries", "restaurant", "transport", "education", "health"]),
	};
}
