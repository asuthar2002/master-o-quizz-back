import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utils/response.util";
import { StatusEnum } from "../constraints/types/responseStatus.enum";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: string; roles: string[] };
}
interface JwtPayload {
  userId: string;
  roles?: string;
  iat: number;
  exp: number;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return sendResponse({
        res,
        status: StatusEnum.FAIL,
        message: "No token provided",
        code: StatusCodes.UNAUTHORIZED,
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = { userId: decoded.userId, roles: decoded.roles || [], };
    next();
  } catch (error) {
    console.error("expired token:", error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: "fail", message: "expired access token" });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.roles?.includes("admin")) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ status: "fail", message: "Access denied. Admins only." });
  }
  next();
};

export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.roles?.includes("user")) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ status: "fail", message: "Access denied. Users only." });
  }
  next();
};
