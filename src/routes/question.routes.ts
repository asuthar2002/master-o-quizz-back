import express from "express";
import { checkQuestionAnswerController, createQuestionController, getAllQuestionsController } from "../controllers/question.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";

const questionRouter = express.Router();
questionRouter.post("/create", verifyToken, isAdmin, createQuestionController);
questionRouter.get("/", getAllQuestionsController);
questionRouter.post("/", verifyToken, checkQuestionAnswerController);

export default questionRouter;
