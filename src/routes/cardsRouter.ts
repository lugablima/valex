import { Router } from "express";
import validateSchema from "../middlewares/schemaValidator";
import * as cardsSchema from "../schemas/cardsSchema";
import * as cardsController from "../controllers/cardsController";

const cardsRouter = Router();

cardsRouter.post("/cards", validateSchema(cardsSchema.card), cardsController.createCard);
cardsRouter.put("/cards", validateSchema(cardsSchema.cardActivation), cardsController.activateCard);
cardsRouter.get("/balance/:cardId", cardsController.viewCardBalanceAndTransactions);

export default cardsRouter;