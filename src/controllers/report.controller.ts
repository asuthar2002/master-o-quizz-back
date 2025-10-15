import { Request, Response } from "express";
import { getUserPerformanceReport, getSkillGapReport, getTimeBasedReport } from "../services/report.service";
import { sendResponse } from "../utils/response.util";
import { StatusEnum } from "../constraints/types/responseStatus.enum";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const getUserPerformanceController = async (req: Request, res: Response) => {
  try {
    const data = await getUserPerformanceReport();

    return sendResponse({
      res,
      status: StatusEnum.SUCCESS,
      message: "User performance report fetched successfully",
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    console.error("Error in getUserPerformanceController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};

export const getSkillGapController = async (req: Request, res: Response) => {
  try {
    const data = await getSkillGapReport();

    return sendResponse({
      res,
      status: StatusEnum.SUCCESS,
      message: "Skill gap report fetched successfully",
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    console.error("Error in getSkillGapController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};

export const getTimeBasedReportController = async (req: Request, res: Response) => {
  try {
    const { filterType } = req.query;
    const validFilter = filterType === "week" || filterType === "month" ? filterType : "month";

    const data = await getTimeBasedReport(validFilter);

    return sendResponse({
      res,
      status: StatusEnum.SUCCESS,
      message: `Time-based report (${validFilter}) fetched successfully`,
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    console.error("Error in getTimeBasedReportController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};
