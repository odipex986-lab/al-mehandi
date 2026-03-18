import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ordersRouter from "./orders";
import adminRouter from "./admin";
import qrRouter from "./qr";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/orders", ordersRouter);
router.use("/admin", adminRouter);
router.use("/qr", qrRouter);

export default router;
