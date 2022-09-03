import { Router } from "express";
import cardsRouter from "./cardsRouter";
import rechargesRouter from "./rechargesRouter";
import paymentsRouter from "./paymentsRouter";

const router = Router();

router.use(cardsRouter);
router.use(rechargesRouter);
router.use(paymentsRouter);

export default router;