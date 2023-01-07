import supertest from "supertest";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import app from "../../src/index";
import { deleteAllData, disconnectPrisma, createScenarioSeed } from "../factories/scenarioFactory";
import * as cardPayloadFactory from "../factories/cardPayloadFactory";
import cardFactory from "../factories/cardFactory";
import * as fakerHelper from "../helpers/faker";
import { decryptCvc, encryptPassword } from "../../src/utils/cardsUtils";
import * as cardsTypes from "../../src/types/cardsTypes";
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
		const cardPayload = cardPayloadFactory.create({ employeeId: employee.id });

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
		const cardPayload = cardPayloadFactory.create({ employeeId: -1 });

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardNotCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(422);
		expect(cardNotCreated).toBeNull();
	});

	it("Should answer with status 400 when not sending header api key", async () => {
		const cardPayload = cardPayloadFactory.create();

		const result = await server.post("/cards").send(cardPayload);

		const cardNotCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(400);
		expect(cardNotCreated).toBeNull();
	});

	it("Should answer with status 401 when sending a invalid header api key", async () => {
		const cardPayload = cardPayloadFactory.create();

		const result = await server.post("/cards").set("x-api-key", faker.datatype.string()).send(cardPayload);

		const cardNotCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(401);
		expect(cardNotCreated).toBeNull();
	});

	it("Should answer with status 404 when sending a invalid employee id", async () => {
		const { company } = await createScenarioSeed();
		const cardPayload = cardPayloadFactory.create({ employeeId: fakerHelper.generateRandomNumber({ min: 2 }) });

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardNotCreated = await prisma.card.findFirst({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(404);
		expect(cardNotCreated).toBeNull();
	});

	it("Should answer with status 409 when sending a payload of an already existing card", async () => {
		const { employee, company } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });
		const cardPayload = cardPayloadFactory.create({
			employeeId: cardCreated.employeeId,
			type: cardCreated.type,
		});

		const result = await server
			.post("/cards")
			.set("x-api-key", company.apiKey as string)
			.send(cardPayload);

		const cardsInTheDatabase = await prisma.card.findMany({
			where: { AND: [{ employeeId: cardPayload.employeeId }, { type: cardPayload.type }] },
		});

		expect(result.status).toBe(409);
		expect(cardsInTheDatabase).toHaveLength(1);
		expect(cardsInTheDatabase).toEqual(expect.arrayContaining([expect.objectContaining({ ...cardCreated })]));
	});
});

describe("PATCH /cards/activate", () => {
	it("Should answer with status 200 when sending a valid payload", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });
		const cardPayload = cardPayloadFactory.activate({
			cardId: cardCreated.id,
			cvc: decryptCvc(cardCreated.securityCode),
		});

		const result = await server.patch("/cards/activate").send(cardPayload);

		const activatedCard = await prisma.card.findUnique({
			where: { id: cardCreated.id },
		});

		expect(result.status).toBe(200);
		expect(cardCreated.password).toBeNull();
		expect(activatedCard).not.toBeNull();
		expect(activatedCard?.password).not.toBeNull();
	});

	it("Should answer with status 422 when sending a invalid payload", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });
		const cardPayload = cardPayloadFactory.activate({ cardId: -1 });

		const result = await server.patch("/cards/activate").send(cardPayload);

		const notActivatedCard = await prisma.card.findUnique({
			where: { id: cardCreated.id },
		});

		expect(result.status).toBe(422);
		expect(cardCreated.password).toBeNull();
		expect(notActivatedCard).not.toBeNull();
		expect(notActivatedCard?.password).toBeNull();
	});

	it("Should answer with status 404 when sending the id of a non-existing card", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });
		const cardPayload = cardPayloadFactory.activate({
			cardId: fakerHelper.generateRandomNumber({ min: cardCreated.id + 1 }),
		});

		const result = await server.patch("/cards/activate").send(cardPayload);

		const notActivatedCard = await prisma.card.findUnique({
			where: { id: cardCreated.id },
		});

		expect(result.status).toBe(404);
		expect(cardCreated.password).toBeNull();
		expect(notActivatedCard).not.toBeNull();
		expect(notActivatedCard?.password).toBeNull();
	});

	it("Should answer with status 401 when trying to activate an expired card", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({
			employeeId: employee.id,
			expirationDate: dayjs().subtract(5, "year").format("MM/YY"),
		});
		const cardPayload = cardPayloadFactory.activate({
			cardId: cardCreated.id,
			cvc: decryptCvc(cardCreated.securityCode),
		});

		const result = await server.patch("/cards/activate").send(cardPayload);

		const notActivatedCard = await prisma.card.findUnique({
			where: { id: cardCreated.id },
		});

		expect(result.status).toBe(401);
		expect(cardCreated.password).toBeNull();
		expect(notActivatedCard).not.toBeNull();
		expect(notActivatedCard?.password).toBeNull();
	});

	it("Should answer with status 409 when trying to activate an already activated card", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({
			employeeId: employee.id,
			password: encryptPassword(fakerHelper.generateRandomPassword()),
		});
		const cardPayload = cardPayloadFactory.activate({
			cardId: cardCreated.id,
			cvc: decryptCvc(cardCreated.securityCode),
		});

		const result = await server.patch("/cards/activate").send(cardPayload);

		const alreadyActivatedCard = await prisma.card.findUnique({
			where: { id: cardCreated.id },
		});

		expect(result.status).toBe(409);
		expect(cardCreated.password).not.toBeNull();
		expect(alreadyActivatedCard).not.toBeNull();
		expect(alreadyActivatedCard?.password).toEqual(cardCreated.password);
	});

	it("Should answer with status 401 when trying to activate a card with an invalid security code", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });
		const cardPayload = cardPayloadFactory.activate({ cardId: cardCreated.id });

		const result = await server.patch("/cards/activate").send(cardPayload);

		const notActivatedCard = await prisma.card.findUnique({
			where: { id: cardCreated.id },
		});

		expect(result.status).toBe(401);
		expect(cardCreated.password).toBeNull();
		expect(notActivatedCard).not.toBeNull();
		expect(notActivatedCard?.password).toBeNull();
	});

	it("Should answer with status 401 when trying to activate a card with invalid password format", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });
		const cardPayload = cardPayloadFactory.activate({
			cardId: cardCreated.id,
			cvc: decryptCvc(cardCreated.securityCode),
			password: fakerHelper.generateRandomPassword(5),
		});

		const result = await server.patch("/cards/activate").send(cardPayload);

		const notActivatedCard = await prisma.card.findUnique({
			where: { id: cardCreated.id },
		});

		expect(result.status).toBe(401);
		expect(cardCreated.password).toBeNull();
		expect(notActivatedCard).not.toBeNull();
		expect(notActivatedCard?.password).toBeNull();
	});
});

describe("GET /cards/balance/:cardId", () => {
	it("Should answer with status 200 when trying to view the balance of a valid card", async () => {
		const { employee } = await createScenarioSeed();
		const cardCreated = await cardFactory({ employeeId: employee.id });

		const result = await server.get(`/cards/balance/${cardCreated.id}`);

		expect(result.status).toBe(200);
		expect(result.body).toEqual<cardsTypes.BalanceCard>({
			balance: 0,
			transactions: [],
			recharges: [],
		});
	});

	it("Should answer with status 400 when not sending card id", async () => {
		const result = await server.get(`/cards/balance/${faker.lorem.word()}`);

		expect(result.status).toBe(400);
	});

	it("Should answer with status 404 when trying to view a balance of a non-existing card", async () => {
		const cardIdNonExisting = fakerHelper.generateRandomNumber({ min: 1 });

		const result = await server.get(`/cards/balance/${cardIdNonExisting}`);

		const cardNoNExisting = await prisma.card.findUnique({
			where: { id: cardIdNonExisting },
		});

		expect(result.status).toBe(404);
		expect(cardNoNExisting).toBeNull();
	});
});
