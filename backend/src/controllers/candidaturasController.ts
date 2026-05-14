// src/controllers/candidaturasController.ts
// Lógica para candidaturas (inscrições em vagas)

import { Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma.js";
import { ok, created, badRequest, notFound, forbidden, conflict } from "../utils/response.js";
import { AuthRequest } from "../types/index.js";

const schemaStatus = z.object({
  statusProcesso: z.enum(["inscrito", "em_analise", "entrevista", "aprovado", "rejeitado"]),
  etapaAtualId: z.string().uuid().optional(),
});

// =============================================
// PARA UNIVERSITÁRIOS
// =============================================

/**
 * POST /api/candidaturas
 * Candidato se inscreve em uma vaga (RN08, RN14)
 */
export async function candidatar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { vagaId } = z.object({ vagaId: z.string().uuid() }).parse(req.body);

    const perfil = await prisma.perfilUniversitario.findUnique({
      where: { usuarioId: req.user!.userId },
    });

    if (!perfil) return notFound(res, "Perfil de universitário não encontrado");

    // Verificar se a vaga existe e está ativa
    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    if (!vaga) return notFound(res, "Vaga não encontrada");
    if (vaga.status !== "ativa") return badRequest(res, "Esta vaga não está mais disponível");

    // RN08: candidatura única por vaga
    const candidaturaExistente = await prisma.candidatura.findUnique({
      where: { vagaId_universitarioId: { vagaId, universitarioId: perfil.id } },
    });
    if (candidaturaExistente) {
      return conflict(res, "Você já se candidatou a esta vaga");
    }

    const candidatura = await prisma.candidatura.create({
      data: { vagaId, universitarioId: perfil.id },
      include: {
        vaga: { include: { empresa: { include: { usuario: { select: { nome: true } } } } } },
      },
    });

    // Notificar empresa sobre nova candidatura (RN15)
    const empresaUsuario = await prisma.perfilEmpresa.findUnique({
      where: { id: vaga.empresaId },
    });

    if (empresaUsuario) {
      await prisma.notificacao.create({
        data: {
          usuarioId: empresaUsuario.usuarioId,
          tipo: "candidatura_recebida",
          titulo: "Nova candidatura recebida!",
          descricao: `${req.user!.email} se candidatou à vaga "${vaga.titulo}"`,
          relacionadoAId: candidatura.id,
        },
      });
    }

    return created(res, candidatura, "Candidatura realizada com sucesso!");
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/candidaturas/minhas
 * Histórico de candidaturas do universitário logado
 */
export async function minhasCandidaturas(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const perfil = await prisma.perfilUniversitario.findUnique({
      where: { usuarioId: req.user!.userId },
    });

    if (!perfil) return notFound(res, "Perfil não encontrado");

    const candidaturas = await prisma.candidatura.findMany({
      where: { universitarioId: perfil.id },
      orderBy: { dataCandidatura: "desc" },
      include: {
        vaga: {
          include: {
            empresa: { include: { usuario: { select: { nome: true } } } },
            etapas: { orderBy: { ordem: "asc" } },
          },
        },
        etapaAtual: true,
      },
    });

    return ok(res, candidaturas);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/candidaturas/:id
 * Cancela candidatura (apenas o próprio universitário)
 */
export async function cancelarCandidatura(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const perfil = await prisma.perfilUniversitario.findUnique({
      where: { usuarioId: req.user!.userId },
    });

    const candidatura = await prisma.candidatura.findUnique({ where: { id } });
    if (!candidatura) return notFound(res, "Candidatura não encontrada");

    if (candidatura.universitarioId !== perfil?.id) {
      return forbidden(res, "Você não tem permissão para cancelar esta candidatura");
    }

    await prisma.candidatura.delete({ where: { id } });

    return ok(res, null, "Candidatura cancelada com sucesso");
  } catch (err) {
    next(err);
  }
}

// =============================================
// PARA EMPRESAS
// =============================================

/**
 * GET /api/vagas/:id/candidaturas
 * Lista candidatos de uma vaga (apenas empresa dona)
 */
export async function candidaturasDaVaga(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id: vagaId } = req.params;

    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: { empresa: true },
    });

    if (!vaga) return notFound(res, "Vaga não encontrada");

    if (vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Você não tem permissão para ver candidatos desta vaga");
    }

    const candidaturas = await prisma.candidatura.findMany({
      where: { vagaId },
      orderBy: { dataCandidatura: "desc" },
      include: {
        universitario: {
          include: { usuario: { select: { nome: true, email: true } } },
        },
        etapaAtual: true,
      },
    });

    return ok(res, candidaturas);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/candidaturas/:id/status
 * Atualiza status do candidato no processo seletivo (RN13)
 */
export async function atualizarStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { statusProcesso, etapaAtualId } = schemaStatus.parse(req.body);

    const candidatura = await prisma.candidatura.findUnique({
      where: { id },
      include: {
        vaga: { include: { empresa: true } },
        universitario: { include: { usuario: true } },
      },
    });

    if (!candidatura) return notFound(res, "Candidatura não encontrada");

    if (candidatura.vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Você não tem permissão para atualizar este candidato");
    }

    const candidaturaAtualizada = await prisma.candidatura.update({
      where: { id },
      data: { statusProcesso, etapaAtualId },
    });

    // Notificar universitário sobre mudança de status (RN15)
    const tipoNotif =
      statusProcesso === "aprovado" ? "aprovado" :
      statusProcesso === "rejeitado" ? "rejeitado" : "etapa_proxima";

    const mensagens = {
      aprovado: `Parabéns! Você foi aprovado na vaga "${candidatura.vaga.titulo}"`,
      rejeitado: `Infelizmente você não foi aprovado na vaga "${candidatura.vaga.titulo}"`,
      etapa_proxima: `Seu processo seletivo para "${candidatura.vaga.titulo}" foi atualizado: ${statusProcesso}`,
    };

    await prisma.notificacao.create({
      data: {
        usuarioId: candidatura.universitario.usuarioId,
        tipo: tipoNotif,
        titulo: "Atualização no processo seletivo",
        descricao: mensagens[tipoNotif as keyof typeof mensagens] || mensagens.etapa_proxima,
        relacionadoAId: id,
      },
    });

    return ok(res, candidaturaAtualizada, "Status atualizado com sucesso");
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/candidatos/recomendados/:vagaId
 * Candidatos mais compatíveis com a vaga (RN09, RN11)
 */
export async function candidatosRecomendados(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { vagaId } = req.params;

    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: { empresa: true },
    });

    if (!vaga) return notFound(res, "Vaga não encontrada");
    if (vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Acesso negado");
    }

    // Busca candidatos inscritos com prioridade por curso compatível (RN09)
    const candidaturas = await prisma.candidatura.findMany({
      where: { vagaId },
      include: {
        universitario: {
          include: { usuario: { select: { nome: true, email: true } } },
        },
        etapaAtual: true,
      },
    });

    // Ordena: curso compatível primeiro
    const ordenadas = candidaturas.sort((a, b) => {
      const cursoA = a.universitario.curso?.toLowerCase() || "";
      const cursoB = b.universitario.curso?.toLowerCase() || "";
      const cursoVaga = vaga.cursoDesejado.toLowerCase();

      const scoreA = cursoA.includes(cursoVaga) || cursoVaga.includes(cursoA) ? 1 : 0;
      const scoreB = cursoB.includes(cursoVaga) || cursoVaga.includes(cursoB) ? 1 : 0;

      return scoreB - scoreA;
    });

    return ok(res, ordenadas);
  } catch (err) {
    next(err);
  }
}
