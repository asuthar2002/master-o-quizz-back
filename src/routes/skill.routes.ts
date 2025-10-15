import express from "express";
import { createSkillController, getAllSkillController } from "../controllers/skill.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";
const skillRouter = express.Router();

skillRouter.post("/create", verifyToken, isAdmin, createSkillController);
skillRouter.get("/", getAllSkillController);

export default skillRouter;
