import express from "express";
import { auth } from "../middlewares/auth.js";
import { getUserResumes } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get-user-resumes", auth, getUserResumes);

export default userRouter;
