import { Request, Response } from "express";
import { checkQuestionAnswerService, createQuestionService, getAllQuestionsService } from "../services/question.service";
import { sendResponse } from "../utils/response.util";
import { StatusEnum } from "../constraints/types/responseStatus.enum";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const createQuestionController = async (req: Request, res: Response) => {
  try {
    // ✅ Expecting an array of skillIds
    const { skillIds, questionText, options, correctOptionIndex } = req.body;

    if (
      !Array.isArray(skillIds) ||
      skillIds.length === 0 ||
      !questionText ||
      !options ||
      correctOptionIndex === undefined
    ) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: "All fields are required (including at least one skillId)",
        code: StatusCodes.BAD_REQUEST,
      });
    }

    const result = await createQuestionService({
      skillIds,
      questionText,
      options,
      correctOptionIndex,
    });

    if (result.success) {
      return sendResponse({
        res,
        status: StatusEnum.SUCCESS,
        message: "Question created successfully",
        code: StatusCodes.CREATED,
        data: result.question,
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.FAIL,
      message: result.error,
      code: StatusCodes.BAD_REQUEST,
    });
  } catch (error) {
    console.error("Error in createQuestionController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};

// ✅ Pagination controller (unchanged except minor defaults)
export const getAllQuestionsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // default 10 per page

    const result = await getAllQuestionsService({ page, limit });

    if (result.success) {
      return sendResponse({
        res,
        status: StatusEnum.SUCCESS,
        message: "Questions fetched successfully",
        code: StatusCodes.OK,
        data: {
          questions: result.questions,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalCount: result.totalCount,
        },
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.FAIL,
      message: result.error || "Failed to fetch questions",
      code: StatusCodes.BAD_REQUEST,
    });
  } catch (error) {
    console.error("Error in getAllQuestionsController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};
export const checkQuestionAnswerController = async (req: Request, res: Response) => {
  try {
    const result = await checkQuestionAnswerService(req.body);

    if (!result.success) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: result.error,
        code: StatusCodes.BAD_REQUEST,
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.SUCCESS,
      message: result.message,
      code: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    console.error("Error in checkQuestionAnswerController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};