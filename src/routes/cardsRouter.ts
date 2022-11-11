import { Router } from "express";
import validateSchema from "../middlewares/schemaValidator";
import * as cardsSchema from "../schemas/cardsSchema";
import * as cardsController from "../controllers/cardsController";

const cardsRouter = Router();

cardsRouter.post("/cards", validateSchema(cardsSchema.create), cardsController.create);
cardsRouter.patch("/cards/activate", validateSchema(cardsSchema.activate), cardsController.activate);
cardsRouter.get("/cards/balance/:cardId", cardsController.viewBalanceAndTransactions);
cardsRouter.patch("/cards/block", validateSchema(cardsSchema.blockOrUnlock), cardsController.block);
cardsRouter.put("/unlock-card", validateSchema(cardsSchema.cardLock), cardsController.unlockCard);
cardsRouter.post("/virtual-card", validateSchema(cardsSchema.virtualCard), cardsController.createVirtualCard);

export default cardsRouter;