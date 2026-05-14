// src/routes/chat.ts
import { Router } from "express";
import { listarMensagens, enviarMensagem, marcarComoLido } from "../controllers/chatController.js";
import { autenticado } from "../middleware/auth.js";

const router = Router();

router.get("/:candidaturaId", autenticado, listarMensagens);
router.post("/:candidaturaId/mensagens", autenticado, enviarMensagem);
router.patch("/:mensagemId/lido", autenticado, marcarComoLido);

export default router;
