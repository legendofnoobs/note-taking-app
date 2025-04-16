import { Router } from "express";
import { login, register, verify } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", protect, verify);

export default router;