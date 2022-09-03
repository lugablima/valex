import { Router } from "express";
import cardsRouter from "./cardsRouter";
import rechargesRouter from "./rechargesRouter";

const router = Router();

router.use(cardsRouter);
router.use(rechargesRouter);

export default router;