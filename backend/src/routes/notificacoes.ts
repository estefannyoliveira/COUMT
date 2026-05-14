// src/routes/notificacoes.ts
import { Router } from "express";
import {
  listarNotificacoes,
  marcarComoLida,
  lerTodas,
  deletarNotificacao,
} from "../controllers/notificacoesController.js";
import { autenticado } from "../middleware/auth.js";

const router = Router();

router.get("/", autenticado, listarNotificacoes);
router.patch("/ler-todas", autenticado, lerTodas);
router.patch("/:id/lido", autenticado, marcarComoLida);
router.delete("/:id", autenticado, deletarNotificacao);

export default router;
