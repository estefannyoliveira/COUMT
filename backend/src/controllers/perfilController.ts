// src/controllers/perfilController.ts
// Lógica para visualizar e atualizar perfis de universitários e empresas

import { Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma.js";
import { ok, badRequest, notFound, forbidden } from "../utils/response.js";
import { AuthRequest } from "../types/index.js";

// =============================================
// SCHEMAS
// =============================================

const schemaAtualizarUniversitario = z.object({
  nome: z.string().min(2).optional(),
  celular: z.string().optional(),
  dataNascimento: z.string().optional(),
  genero: z.string().optional(),
  localizacao: z.string().optional(),
  matricula: z.string().optional(),
  curso: z.string().optional(),
  instituicao: z.string().optional(),
  bio: z.string().optional(),
  fotoUrl: z.string().url().optional().or(z.literal("")),
  cvUrl: z.string().url().optional().or(z.literal("")),
});

const schemaAtualizarEmpresa = z.object({
  nome: z.string().min(2).optional(),
  descricao: z.string().optional(),
  localizacao: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  telefone: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

// =============================================
// CONTROLLERS
// =============================================

/**
 * GET /api/perfil/universitario/:id
 * Perfil público de um universitário
 */
export async function getPerfilUniversitario(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const perfil = await prisma.perfilUniversitario.findUnique({
      where: { id },
      include: {
        usuario: { select: { nome: true, email: true, criadoEm: true } },
      },
    });

    if (!perfil) return notFound(res, "Perfil não encontrado");

    return ok(res, perfil);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/perfil/universitario
 * Atualiza perfil do universitário logado (RN16)
 */
export async function atualizarPerfilUniversitario(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (req.user?.tipo !== "universitario") {
      return forbidden(res, "Apenas universitários podem atualizar este perfil");
    }

    const dados = schemaAtualizarUniversitario.parse(req.body);
    const { nome, ...dadosPerfil } = dados;

    // Atualiza nome no usuário, se fornecido
    if (nome) {
      await prisma.usuario.update({
        where: { id: req.user.userId },
        data: { nome },
      });
    }

    const perfil = await prisma.perfilUniversitario.update({
      where: { usuarioId: req.user.userId },
      data: {
        ...dadosPerfil,
        dataNascimento: dadosPerfil.dataNascimento
          ? new Date(dadosPerfil.dataNascimento)
          : undefined,
        fotoUrl: dadosPerfil.fotoUrl || undefined,
        cvUrl: dadosPerfil.cvUrl || undefined,
      },
    });

    return ok(res, perfil, "Perfil atualizado com sucesso");
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/perfil/empresa/:id
 * Perfil público de uma empresa
 */
export async function getPerfilEmpresa(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const perfil = await prisma.perfilEmpresa.findUnique({
      where: { id },
      include: {
        usuario: { select: { nome: true, email: true, criadoEm: true } },
        vagas: {
          where: { status: "ativa" },
          select: {
            id: true,
            titulo: true,
            area: true,
            localizacao: true,
            nivel: true,
            dataPublicacao: true,
          },
          take: 10,
        },
      },
    });

    if (!perfil) return notFound(res, "Perfil não encontrado");

    return ok(res, perfil);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/perfil/empresa
 * Atualiza perfil da empresa logada (RN16)
 */
export async function atualizarPerfilEmpresa(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (req.user?.tipo !== "empresa") {
      return forbidden(res, "Apenas empresas podem atualizar este perfil");
    }

    const dados = schemaAtualizarEmpresa.parse(req.body);
    const { nome, ...dadosPerfil } = dados;

    if (nome) {
      await prisma.usuario.update({
        where: { id: req.user.userId },
        data: { nome },
      });
    }

    const perfil = await prisma.perfilEmpresa.update({
      where: { usuarioId: req.user.userId },
      data: {
        ...dadosPerfil,
        website: dadosPerfil.website || undefined,
        logoUrl: dadosPerfil.logoUrl || undefined,
      },
    });

    return ok(res, perfil, "Perfil atualizado com sucesso");
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/perfil/me
 * Retorna perfil completo do usuário logado
 */
export async function meuPerfil(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;

    if (req.user?.tipo === "universitario") {
      const perfil = await prisma.perfilUniversitario.findUnique({
        where: { usuarioId: userId },
        include: {
          usuario: { select: { nome: true, email: true } },
        },
      });
      return ok(res, perfil);
    }

    const perfil = await prisma.perfilEmpresa.findUnique({
      where: { usuarioId: userId },
      include: {
        usuario: { select: { nome: true, email: true } },
      },
    });
    return ok(res, perfil);
  } catch (err) {
    next(err);
  }
}

export { badRequest };
