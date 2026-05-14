// src/controllers/etapasController.ts
// Gerenciamento das etapas do processo seletivo de cada vaga

import { Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma.js";
import { ok, created, notFound, forbidden } from "../utils/response.js";
import { AuthRequest } from "../types/index.js";

const schemaCriarEtapa = z.object({
  nomeEtapa: z.string().min(2, "Nome da etapa obrigatório"),
  tipo: z.enum(["analise", "entrevista", "teste", "aprovacao"]).default("analise"),
  descricao: z.string().optional(),
  ordem: z.number().int().positive(),
});

/**
 * GET /api/vagas/:vagaId/etapas
 * Lista etapas do processo seletivo de uma vaga
 */
export async function listarEtapas(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { vagaId } = req.params;

    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    if (!vaga) return notFound(res, "Vaga não encontrada");

    const etapas = await prisma.etapaProcesso.findMany({
      where: { vagaId },
      orderBy: { ordem: "asc" },
    });

    return ok(res, etapas);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/vagas/:vagaId/etapas
 * Cria nova etapa do processo (apenas empresa dona - RN12)
 */
export async function criarEtapa(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { vagaId } = req.params;
    const dados = schemaCriarEtapa.parse(req.body);

    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: { empresa: true },
    });

    if (!vaga) return notFound(res, "Vaga não encontrada");

    if (vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Você não tem permissão para configurar esta vaga");
    }

    // Calcular número da etapa automaticamente
    const totalEtapas = await prisma.etapaProcesso.count({ where: { vagaId } });

    const etapa = await prisma.etapaProcesso.create({
      data: {
        vagaId,
        numeroEtapa: totalEtapas + 1,
        ...dados,
      },
    });

    return created(res, etapa, "Etapa criada com sucesso");
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/etapas/:id
 * Edita uma etapa do processo
 */
export async function editarEtapa(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const dados = schemaCriarEtapa.partial().parse(req.body);

    const etapa = await prisma.etapaProcesso.findUnique({
      where: { id },
      include: { vaga: { include: { empresa: true } } },
    });

    if (!etapa) return notFound(res, "Etapa não encontrada");

    if (etapa.vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Você não tem permissão para editar esta etapa");
    }

    const etapaAtualizada = await prisma.etapaProcesso.update({
      where: { id },
      data: dados,
    });

    return ok(res, etapaAtualizada, "Etapa atualizada com sucesso");
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/etapas/:id
 * Remove uma etapa do processo
 */
export async function deletarEtapa(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const etapa = await prisma.etapaProcesso.findUnique({
      where: { id },
      include: { vaga: { include: { empresa: true } } },
    });

    if (!etapa) return notFound(res, "Etapa não encontrada");

    if (etapa.vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Você não tem permissão para deletar esta etapa");
    }

    await prisma.etapaProcesso.delete({ where: { id } });

    return ok(res, null, "Etapa removida com sucesso");
  } catch (err) {
    next(err);
  }
}
