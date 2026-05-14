// src/utils/jwt.ts
// Funções para geração e verificação de tokens JWT

import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_troque_em_producao";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Gera um token JWT para o usuário autenticado
 */
export function gerarToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verifica e decodifica um token JWT
 * Retorna null se inválido ou expirado
 */
export function verificarToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
