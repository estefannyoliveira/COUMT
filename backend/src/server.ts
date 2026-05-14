// src/server.ts
// Ponto de entrada do servidor COUMT Backend

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Rotas
import authRoutes from "./routes/auth.js";
import vagasRoutes from "./routes/vagas.js";
import candidaturasRoutes from "./routes/candidaturas.js";
import etapasRoutes from "./routes/etapas.js";
import chatRoutes from "./routes/chat.js";
import notificacoesRoutes from "./routes/notificacoes.js";
import perfilRoutes from "./routes/perfil.js";

// Middleware de erro
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARES GLOBAIS
// =============================================

// Segurança: headers HTTP seguros
app.use(helmet());

// CORS: permite requisições do frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =============================================
// ROTA DE SAÚDE
// =============================================

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "COUMT API - Conectando Universitários ao Mercado de Trabalho",
    versao: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// =============================================
// ROTAS DA API
// =============================================

app.use("/api/auth", authRoutes);
app.use("/api/vagas", vagasRoutes);
app.use("/api/candidaturas", candidaturasRoutes);
app.use("/api/etapas", etapasRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notificacoes", notificacoesRoutes);
app.use("/api/perfil", perfilRoutes);

// =============================================
// HANDLER DE ERROS GLOBAL
// =============================================

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.method} ${req.path}`,
  });
});

// Erros gerais
app.use(errorHandler);

// =============================================
// INICIALIZA SERVIDOR
// =============================================

app.listen(PORT, () => {
  console.log(`\n🚀 COUMT Backend rodando!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🌎 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/vagas`);
  console.log(`   POST   /api/vagas`);
  console.log(`   POST   /api/candidaturas`);
  console.log(`   GET    /api/chat/:candidaturaId`);
  console.log(`   GET    /api/notificacoes`);
  console.log(`\n✅ Pronto para receber requisições!\n`);
});

export default app;
