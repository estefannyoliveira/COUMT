// src/routes/vagas.ts
import { Router } from "express";
import {
  listarVagas,
  getVaga,
  criarVaga,
  editarVaga,
  deletarVaga,
  minhasVagas,
  recomendacoes,
} from "../controllers/vagasController.js";
import { candidaturasDaVaga } from "../controllers/candidaturasController.js";
import { listarEtapas, criarEtapa } from "../controllers/etapasController.js";
import { autenticado, apenasEmpresa, apenasUniversitario } from "../middleware/auth.js";

const router = Router();

// Rotas públicas
router.get("/", listarVagas);
router.get("/empresa/minhas", autenticado, apenasEmpresa, minhasVagas);
router.get("/recomendacoes", autenticado, apenasUniversitario, recomendacoes);
router.get("/:id", getVaga);

// Rotas de empresa
router.post("/", autenticado, apenasEmpresa, criarVaga);
router.put("/:id", autenticado, apenasEmpresa, editarVaga);
router.delete("/:id", autenticado, apenasEmpresa, deletarVaga);

// Candidaturas de uma vaga (empresa)
router.get("/:id/candidaturas", autenticado, apenasEmpresa, candidaturasDaVaga);

// Etapas do processo seletivo
router.get("/:vagaId/etapas", listarEtapas);
router.post("/:vagaId/etapas", autenticado, apenasEmpresa, criarEtapa);

export default router;
