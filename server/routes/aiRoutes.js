import express from "express";  
import {auth} from '../middlewares/auth.js'
import { generateEnhancedResume, resumeReview, skillGrowth } from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview);
aiRouter.post("/skill-growth", upload.single("resume"), auth,skillGrowth);
aiRouter.post("/resume-builder",auth, generateEnhancedResume);

export default aiRouter