import { Router } from "express";
import validateSchema from "../middlewares/schemaValidator";
import * as paymentsSchema from "../schemas/paymentsSchema";
import * as paymentsController from "../controllers/paymentsController";

const paymentsRouter = Router();

paymentsRouter.post("/payments", validateSchema(paymentsSchema.payment), paymentsController.pay);
paymentsRouter.post("/payments/online", validateSchema(paymentsSchema.onlinePayment), paymentsController.payOnline);

export default paymentsRouter;
