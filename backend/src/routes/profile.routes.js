import { Router } from "express";
import { findUserProfileController } from "../controller/profile/getUserProfile.controller.js";

const router = Router();

router.post("/user", findUserProfileController)

export default router;