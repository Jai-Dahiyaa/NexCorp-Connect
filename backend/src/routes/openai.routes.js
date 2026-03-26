import Router from"express";
import { openAIController } from "../controller/openai/openai.controller.js";

const router = Router();

router.post("/ask", openAIController)

export default router;