// src/types/index.ts
// Tipos e interfaces globais do COUMT

import { Request } from "express";

// =============================================
// AUTENTICAÇÃO
// =============================================

/** Payload armazenado no JWT */
export interface JwtPayload {
  userId: string;
  email: string;
  tipo: "universitario" | "empresa";
}

/** Request com usuário autenticado */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// =============================================
// RESPOSTAS DA API
// =============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// =============================================
// FILTROS
// =============================================

export interface FiltrosVaga {
  area?: string;
  localizacao?: string;
  cursoDesejado?: string;
  nivel?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
