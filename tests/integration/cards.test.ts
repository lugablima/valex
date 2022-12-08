import supertest from "supertest";
import app from "../../src/index";
import { deleteAllData, disconnectPrisma, createScenarioSeed } from "../factories/scenarioFactory";
import * as cardsPayloadFactory from "../factories/cardsPayloadFactory";
import { prisma } from "../../src/config/prisma";

beforeEach(async () => {
	await deleteAllData();
});

afterAll(async () => {
	await disconnectPrisma();
});

const server = supertest(app);

describe("POST /cards", () => {
	it("Should answer with status 201 when sending a valid payload", async () => {
		const { employee, company } = await createScenarioSeed();
		const cardPayload = cardsPayloadFactory.validPayload(employee.id);

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(201);
		expect(cardCreated).not.toBeNull();
		// expect(result.body).toEqual(cardCreated).
	});

	it.todo("Should answer with status 422 when sending a invalid payload");
	it.todo("Should answer with status 400 when not sending header api key");
	it.todo("Should answer with status 401 when sending a invalid header api key");
	it.todo("Should answer with status 404 when sending a invalid employee id");
	it.todo("Should answer with status 409 when sending a payload of an already existing card");
});
