// src/middleware/errorHandler.ts
// Middleware global de tratamento de erros

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Erros de validação Zod
  if (err instanceof ZodError) {
    const mensagens = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    return res.status(400).json({
      success: false,
      error: "Dados inválidos",
      detalhes: mensagens,
    });
  }

  // Erros do Prisma
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as { code?: string };

    if (prismaErr.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Já existe um registro com esses dados únicos",
      });
    }

    if (prismaErr.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Registro não encontrado",
      });
    }
  }

  // Erro genérico
  return res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor"
        : err.message,
  });
}
