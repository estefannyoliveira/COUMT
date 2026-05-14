// src/controllers/notificacoesController.ts
// Gerenciamento de notificações do usuário (RN15)

import { Response, NextFunction } from "express";
import { prisma } from "../database/prisma.js";
import { ok, notFound, forbidden } from "../utils/response.js";
import { AuthRequest } from "../types/index.js";

/**
 * GET /api/notificacoes
 * Lista notificações do usuário logado
 */
export async function listarNotificacoes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notificacoes = await prisma.notificacao.findMany({
      where: { usuarioId: req.user!.userId },
      orderBy: { dataCriacao: "desc" },
      take: 50,
    });

    const naoLidas = notificacoes.filter((n) => !n.lido).length;

    return ok(res, { notificacoes, naoLidas });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notificacoes/:id/lido
 * Marca uma notificação como lida
 */
export async function marcarComoLida(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const notificacao = await prisma.notificacao.findUnique({ where: { id } });
    if (!notificacao) return notFound(res, "Notificação não encontrada");

    if (notificacao.usuarioId !== req.user!.userId) {
      return forbidden(res, "Acesso negado");
    }

    await prisma.notificacao.update({ where: { id }, data: { lido: true } });

    return ok(res, null, "Notificação marcada como lida");
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/notificacoes/ler-todas
 * Marca todas as notificações do usuário como lidas
 */
export async function lerTodas(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.notificacao.updateMany({
      where: { usuarioId: req.user!.userId, lido: false },
      data: { lido: true },
    });

    return ok(res, null, "Todas as notificações foram marcadas como lidas");
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/notificacoes/:id
 * Remove uma notificação
 */
export async function deletarNotificacao(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const notificacao = await prisma.notificacao.findUnique({ where: { id } });
    if (!notificacao) return notFound(res, "Notificação não encontrada");

    if (notificacao.usuarioId !== req.user!.userId) {
      return forbidden(res, "Acesso negado");
    }

    await prisma.notificacao.delete({ where: { id } });

    return ok(res, null, "Notificação removida");
  } catch (err) {
    next(err);
  }
}
