// src/routes/auth.ts
import { Router } from "express";
import { register, login, logout, me } from "../controllers/authController.js";
import { autenticado } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", autenticado, logout);
router.get("/me", autenticado, me);

export default router;
