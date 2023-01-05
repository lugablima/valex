import supertest from "supertest";
import { faker } from "@faker-js/faker";
import app from "../../src/index";
import { deleteAllData, disconnectPrisma, createScenarioSeed } from "../factories/scenarioFactory";
import { cardPayloadFactory } from "../factories/cardPayloadFactory";
import cardFactory from "../factories/cardFactory";
import * as fakerHelper from "../helpers/faker";
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
		const cardPayload = cardPayloadFactory({ employeeId: employee.id });

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(201);
		expect(cardCreated).not.toBeNull();
		expect(result.body.id).toEqual(cardCreated?.id);
	});

	it("Should answer with status 422 when sending a invalid payload", async () => {
		const { company } = await createScenarioSeed();
		const cardPayload = cardPayloadFactory({ employeeId: -1 });

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(422);
		expect(cardCreated).toBeNull();
	});

	it("Should answer with status 400 when not sending header api key", async () => {
		const cardPayload = cardPayloadFactory();

		const result = await server.post("/cards").send(cardPayload);

		const cardCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(400);
		expect(cardCreated).toBeNull();
	});

	it("Should answer with status 401 when sending a invalid header api key", async () => {
		const cardPayload = cardPayloadFactory();

		const result = await server.post("/cards").set("x-api-key", faker.datatype.string()).send(cardPayload);

		const cardCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(401);
		expect(cardCreated).toBeNull();
	});

	it("Should answer with status 404 when sending a invalid employee id", async () => {
		const { company } = await createScenarioSeed();
		const cardPayload = cardPayloadFactory({ employeeId: fakerHelper.generateRandomNumber({ min: 2 }) });

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(404);
		expect(cardCreated).toBeNull();
	});

	it("Should answer with status 409 when sending a payload of an already existing card", async () => {
		const { employee, company } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });
		const cardPayload = cardPayloadFactory({
			employeeId: cardCreated.employeeId,
			type: cardCreated.type,
		});

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardDatabase = await prisma.card.findMany({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(409);
		expect(cardDatabase).toHaveLength(1);
	});
});
