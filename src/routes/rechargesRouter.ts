import { Router } from "express";
import validateSchema from "../middlewares/schemaValidator";
import * as rechargesSchema from "../schemas/rechargesSchema";
import * as rechargesController from "../controllers/rechargesController";

const rechargesRouter = Router();

rechargesRouter.post("/recharges", validateSchema(rechargesSchema.recharge), rechargesController.rechargeCard);

export default rechargesRouter;