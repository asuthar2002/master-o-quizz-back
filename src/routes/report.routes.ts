import express from "express";
import { getUserPerformanceController, getSkillGapController, getTimeBasedReportController, } from "../controllers/report.controller";

const reportRouter = express.Router();

reportRouter.get("/user-performance", getUserPerformanceController);
reportRouter.get("/skill-gap", getSkillGapController);
reportRouter.get("/time-report", getTimeBasedReportController);

export default reportRouter;
