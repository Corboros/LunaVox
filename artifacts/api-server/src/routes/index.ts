import { Router, type IRouter } from "express";
import healthRouter from "./health";
import horoscopeRouter from "./horoscope";
import compatibilityRouter from "./compatibility";
import consultantsRouter from "./consultants";
import userRouter from "./user";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/horoscope", horoscopeRouter);
router.use("/compatibility", compatibilityRouter);
router.use("/consultants", consultantsRouter);
router.use("/user", userRouter);
router.use("/payments", paymentsRouter);

export default router;
