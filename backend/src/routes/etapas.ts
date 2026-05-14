// src/routes/etapas.ts
import { Router } from "express";
import { editarEtapa, deletarEtapa } from "../controllers/etapasController.js";
import { autenticado, apenasEmpresa } from "../middleware/auth.js";

const router = Router();

router.put("/:id", autenticado, apenasEmpresa, editarEtapa);
router.delete("/:id", autenticado, apenasEmpresa, deletarEtapa);

export default router;
