// src/utils/response.ts
// Helpers para padronizar respostas da API

import { Response } from "express";

/** Resposta de sucesso (200) */
export function ok<T>(res: Response, data: T, message?: string) {
  return res.status(200).json({ success: true, message, data });
}

/** Resposta de criação (201) */
export function created<T>(res: Response, data: T, message?: string) {
  return res.status(201).json({ success: true, message, data });
}

/** Erro de validação / requisição inválida (400) */
export function badRequest(res: Response, message: string) {
  return res.status(400).json({ success: false, error: message });
}

/** Não autorizado - sem token ou token inválido (401) */
export function unauthorized(res: Response, message = "Não autorizado") {
  return res.status(401).json({ success: false, error: message });
}

/** Proibido - autenticado mas sem permissão (403) */
export function forbidden(res: Response, message = "Acesso negado") {
  return res.status(403).json({ success: false, error: message });
}

/** Recurso não encontrado (404) */
export function notFound(res: Response, message = "Recurso não encontrado") {
  return res.status(404).json({ success: false, error: message });
}

/** Conflito - ex: email já cadastrado (409) */
export function conflict(res: Response, message: string) {
  return res.status(409).json({ success: false, error: message });
}

/** Erro interno do servidor (500) */
export function serverError(res: Response, message = "Erro interno do servidor") {
  return res.status(500).json({ success: false, error: message });
}
