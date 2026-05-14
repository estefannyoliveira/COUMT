// src/controllers/chatController.ts
// Chat entre empresa e candidato (RN14: apenas após candidatura)

import { Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma.js";
import { ok, created, notFound, forbidden } from "../utils/response.js";
import { AuthRequest } from "../types/index.js";

/**
 * Verifica se o usuário tem acesso ao chat de uma candidatura
 * (apenas o candidato ou a empresa da vaga)
 */
async function verificarAcessoChat(candidaturaId: string, userId: string) {
  const candidatura = await prisma.candidatura.findUnique({
    where: { id: candidaturaId },
    include: {
      universitario: true,
      vaga: { include: { empresa: true } },
    },
  });

  if (!candidatura) return null;

  const eUniversitario = candidatura.universitario.usuarioId === userId;
  const eEmpresa = candidatura.vaga.empresa.usuarioId === userId;

  if (!eUniversitario && !eEmpresa) return null;

  return candidatura;
}

/**
 * GET /api/chat/:candidaturaId
 * Lista mensagens de uma candidatura (RN14)
 */
export async function listarMensagens(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { candidaturaId } = req.params;

    const candidatura = await verificarAcessoChat(candidaturaId, req.user!.userId);
    if (!candidatura) return forbidden(res, "Você não tem acesso a este chat");

    const mensagens = await prisma.chat.findMany({
      where: { candidaturaId },
      orderBy: { dataEnvio: "asc" },
      include: {
        remetente: { select: { id: true, nome: true, tipo: true } },
      },
    });

    // Marca mensagens do outro como lidas
    await prisma.chat.updateMany({
      where: {
        candidaturaId,
        remetenteId: { not: req.user!.userId },
        lido: false,
      },
      data: { lido: true },
    });

    return ok(res, mensagens);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/chat/:candidaturaId/mensagens
 * Envia mensagem em uma candidatura
 */
export async function enviarMensagem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { candidaturaId } = req.params;
    const { conteudo } = z.object({
      conteudo: z.string().min(1, "Mensagem não pode ser vazia").max(2000),
    }).parse(req.body);

    const candidatura = await verificarAcessoChat(candidaturaId, req.user!.userId);
    if (!candidatura) return forbidden(res, "Você não tem acesso a este chat");

    const mensagem = await prisma.chat.create({
      data: {
        candidaturaId,
        remetenteId: req.user!.userId,
        conteudo,
      },
      include: {
        remetente: { select: { id: true, nome: true, tipo: true } },
      },
    });

    return created(res, mensagem);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/chat/:mensagemId/lido
 * Marca mensagem como lida
 */
export async function marcarComoLido(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { mensagemId } = req.params;

    const mensagem = await prisma.chat.findUnique({
      where: { id: mensagemId },
      include: {
        candidatura: {
          include: {
            universitario: true,
            vaga: { include: { empresa: true } },
          },
        },
      },
    });

    if (!mensagem) return notFound(res, "Mensagem não encontrada");

    const userId = req.user!.userId;
    const eParticipante =
      mensagem.candidatura.universitario.usuarioId === userId ||
      mensagem.candidatura.vaga.empresa.usuarioId === userId;

    if (!eParticipante) return forbidden(res, "Acesso negado");

    await prisma.chat.update({
      where: { id: mensagemId },
      data: { lido: true },
    });

    return ok(res, null, "Mensagem marcada como lida");
  } catch (err) {
    next(err);
  }
}
