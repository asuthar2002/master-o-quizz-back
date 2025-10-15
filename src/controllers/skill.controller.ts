import { Request, Response } from "express";
import { createSkillService, getAllSkillService } from "../services/skill.service";
import { sendResponse } from "../utils/response.util";
import { StatusEnum } from "../constraints/types/responseStatus.enum";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const createSkillController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: "Skill name is required",
        code: StatusCodes.BAD_REQUEST,
      });
    }

    const result = await createSkillService({ name });

    if (result.success) {
      return sendResponse({
        res,
        status: StatusEnum.SUCCESS,
        message: "Skill created successfully",
        code: StatusCodes.CREATED,
        data: result.skill,
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.FAIL,
      message: result.error,
      code: StatusCodes.BAD_REQUEST,
    });
  } catch (error) {
    console.error("Error in createSkillController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};
export const getAllSkillController = async (req: Request, res: Response) => {
  try {
    const result = await getAllSkillService();
    return sendResponse({
      res,
      status: StatusEnum.SUCCESS,
      message: result.message,
      code: StatusCodes.OK,
      data: result.skills,
    });
  } catch (error) {
    console.error("Error in createSkillController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};
