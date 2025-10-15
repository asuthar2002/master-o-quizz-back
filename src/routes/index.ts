import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { sendResponse } from "../utils/response.util";
import { StatusEnum } from "../constraints/types/responseStatus.enum";
import { notFound } from "../middlewares/notfound.middleware";
import { errorHandler } from "../middlewares/error.middleware";
import authRoute from "./auth.routes";
import questionRouter from "./question.routes";
import skillRouter from "./skill.routes";
import reportRouter from "./report.routes";
const router = Router()

router.get("/", (req: Request, res: Response) => {
    sendResponse({
        res,
        status: StatusEnum.SUCCESS,
        message: ReasonPhrases.OK,
        code: StatusCodes.OK,
        data: [
            {
                message: "Welcome to TalentSync!",
            },
        ],
    });
});

router.use('/auth', authRoute)
router.use('/admin/question', questionRouter)
router.use("/admin/skills", skillRouter);
router.use("/admin/report", reportRouter);
router.use(notFound);
router.use(errorHandler);

export default router;
