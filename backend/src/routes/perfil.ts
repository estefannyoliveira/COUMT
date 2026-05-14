// src/routes/perfil.ts
import { Router } from "express";
import {
  getPerfilUniversitario,
  atualizarPerfilUniversitario,
  getPerfilEmpresa,
  atualizarPerfilEmpresa,
  meuPerfil,
} from "../controllers/perfilController.js";
import { autenticado, apenasUniversitario, apenasEmpresa } from "../middleware/auth.js";

const router = Router();

router.get("/me", autenticado, meuPerfil);
router.get("/universitario/:id", getPerfilUniversitario);
router.put("/universitario", autenticado, apenasUniversitario, atualizarPerfilUniversitario);
router.get("/empresa/:id", getPerfilEmpresa);
router.put("/empresa", autenticado, apenasEmpresa, atualizarPerfilEmpresa);

export default router;
