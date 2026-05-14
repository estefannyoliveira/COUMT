// src/routes/candidaturas.ts
import { Router } from "express";
import {
  candidatar,
  minhasCandidaturas,
  cancelarCandidatura,
  atualizarStatus,
  candidatosRecomendados,
} from "../controllers/candidaturasController.js";
import { autenticado, apenasUniversitario, apenasEmpresa } from "../middleware/auth.js";

const router = Router();

// Universitário
router.post("/", autenticado, apenasUniversitario, candidatar);
router.get("/minhas", autenticado, apenasUniversitario, minhasCandidaturas);
router.delete("/:id", autenticado, apenasUniversitario, cancelarCandidatura);

// Empresa
router.patch("/:id/status", autenticado, apenasEmpresa, atualizarStatus);

// Recomendações de candidatos
router.get("/recomendados/:vagaId", autenticado, apenasEmpresa, candidatosRecomendados);

export default router;
