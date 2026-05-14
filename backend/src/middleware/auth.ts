// src/middleware/auth.ts
// Middlewares de autenticação e autorização por tipo de usuário

import { Response, NextFunction } from "express";
import { verificarToken } from "../utils/jwt.js";
import { unauthorized, forbidden } from "../utils/response.js";
import { AuthRequest } from "../types/index.js";

/**
 * Middleware: verifica se o usuário está autenticado (JWT válido)
 * Injeta `req.user` com os dados do token
 */
export function autenticado(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(res, "Token de autenticação não fornecido");
  }

  const token = authHeader.split(" ")[1];
  const payload = verificarToken(token);

  if (!payload) {
    return unauthorized(res, "Token inválido ou expirado");
  }

  req.user = payload;
  next();
}

/**
 * Middleware: exige que o usuário seja do tipo 'universitario'
 * Usar após `autenticado`
 */
export function apenasUniversitario(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.tipo !== "universitario") {
    return forbidden(res, "Apenas universitários podem realizar esta ação");
  }
  next();
}

/**
 * Middleware: exige que o usuário seja do tipo 'empresa'
 * Usar após `autenticado`
 */
export function apenasEmpresa(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.tipo !== "empresa") {
    return forbidden(res, "Apenas empresas podem realizar esta ação");
  }
  next();
}
