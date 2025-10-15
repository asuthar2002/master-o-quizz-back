import { Request, Response } from "express";
import { signupService, loginService, createAdminService, refreshService } from "../services/auth..Service";
import { sendResponse } from "../utils/response.util";
import { StatusEnum } from "../constraints/types/responseStatus.enum";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { generateAccessToken } from "../utils/jwt.utils";

export const signupController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: "All fields are required",
        code: StatusCodes.BAD_REQUEST,
      });
    }
    const result = await signupService(fullName, email, password);

    if (result.success) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return sendResponse({
        res,
        message: "User registered successfully",
        status: StatusEnum.SUCCESS,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        },
        code: StatusCodes.CREATED,
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.FAIL,
      message: result.error,
      code: StatusCodes.BAD_REQUEST,
    });
  } catch (error) {
    console.error("Error in register controller:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: "All fields are required",
        code: StatusCodes.BAD_REQUEST,
      });
    }

    const result = await loginService(email, password);

    if (result.success) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendResponse({
        res,
        status: StatusEnum.SUCCESS,
        message: "Logged in successfully",
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        },
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.FAIL,
      message: result.error,
      code: StatusCodes.UNAUTHORIZED,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};



export const createAdminController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: "All fields are required",
        code: StatusCodes.BAD_REQUEST,
      });
    }

    const result = await createAdminService(fullName, email, password);

    if (result.success) {
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendResponse({
        res,
        status: StatusEnum.SUCCESS,
        message: "Admin user created successfully",
        code: StatusCodes.CREATED,
        data: {
          accessToken: result.accessToken,
          admin: result.admin,
        },
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.FAIL,
      message: result.error,
      code: StatusCodes.BAD_REQUEST,
    });
  } catch (error) {
    console.error("Error in createAdminController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error,
    });
  }
};


export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const token = req.body?.refreshToken;
    if (!token) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: "No refresh token found",
        code: StatusCodes.UNAUTHORIZED,
      });
    }

    const result = await refreshService(token);

    if (!result.success || !result.user) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: result.error || "Invalid refresh token",
        code: StatusCodes.UNAUTHORIZED,
      });
    }

    return sendResponse({
      res,
      status: StatusEnum.SUCCESS,
      message: "User session revalidated",
      data: result,
      code: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Error in refreshTokenController:", error);
    return sendResponse({
      res,
      status: StatusEnum.ERROR,
      message: "Internal server error",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
