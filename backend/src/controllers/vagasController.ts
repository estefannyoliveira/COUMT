// src/controllers/vagasController.ts
// Lógica de negócio para vagas de estágio

import { Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma.js";
import { ok, created, badRequest, notFound, forbidden } from "../utils/response.js";
import { AuthRequest, FiltrosVaga } from "../types/index.js";

// =============================================
// SCHEMAS
// =============================================

const schemaCriarVaga = z.object({
  titulo: z.string().min(3, "Título muito curto"),
  descricao: z.string().min(10, "Descrição muito curta"),
  area: z.string().min(2, "Área obrigatória"),
  cursoDesejado: z.string().min(2, "Curso desejado obrigatório"),
  localizacao: z.string().min(2, "Localização obrigatória"),
  duracaoEstagio: z.string().min(1, "Duração do estágio obrigatória"),
  salario: z.number().positive().optional(),
  nivel: z.enum(["iniciante", "intermediario", "avancado"]).default("iniciante"),
  dataExpiracao: z.string().min(1, "Data de expiração obrigatória"),
});

const schemaFiltros = z.object({
  area: z.string().optional(),
  localizacao: z.string().optional(),
  cursoDesejado: z.string().optional(),
  nivel: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

// =============================================
// CONTROLLERS
// =============================================

/**
 * GET /api/vagas
 * Lista todas as vagas ativas com filtros e paginação (RN07)
 */
export async function listarVagas(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filtros = schemaFiltros.parse(req.query) as FiltrosVaga;
    const { area, localizacao, cursoDesejado, nivel, search, page = 1, limit = 10 } = filtros;

    const skip = (page - 1) * limit;
    const hoje = new Date();

    // Atualiza vagas expiradas automaticamente
    await prisma.vaga.updateMany({
      where: { dataExpiracao: { lt: hoje }, status: "ativa" },
      data: { status: "expirada" },
    });

    const where = {
      status: "ativa" as const,
      ...(area && { area: { contains: area, mode: "insensitive" as const } }),
      ...(localizacao && { localizacao: { contains: localizacao, mode: "insensitive" as const } }),
      ...(cursoDesejado && { cursoDesejado: { contains: cursoDesejado, mode: "insensitive" as const } }),
      ...(nivel && { nivel: nivel as "iniciante" | "intermediario" | "avancado" }),
      ...(search && {
        OR: [
          { titulo: { contains: search, mode: "insensitive" as const } },
          { descricao: { contains: search, mode: "insensitive" as const } },
          { area: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [vagas, total] = await Promise.all([
      prisma.vaga.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dataPublicacao: "desc" },
        include: {
          empresa: {
            include: {
              usuario: { select: { nome: true } },
            },
          },
          _count: { select: { candidaturas: true } },
        },
      }),
      prisma.vaga.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: vagas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/vagas/:id
 * Detalhes de uma vaga específica
 */
export async function getVaga(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const vaga = await prisma.vaga.findUnique({
      where: { id },
      include: {
        empresa: {
          include: { usuario: { select: { nome: true, email: true } } },
        },
        etapas: { orderBy: { ordem: "asc" } },
        _count: { select: { candidaturas: true } },
      },
    });

    if (!vaga) return notFound(res, "Vaga não encontrada");

    return ok(res, vaga);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/vagas
 * Cria nova vaga (apenas empresas - RN05)
 */
export async function criarVaga(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const dados = schemaCriarVaga.parse(req.body);

    const empresaPerfil = await prisma.perfilEmpresa.findUnique({
      where: { usuarioId: req.user!.userId },
    });

    if (!empresaPerfil) {
      return notFound(res, "Perfil de empresa não encontrado");
    }

    const vaga = await prisma.vaga.create({
      data: {
        ...dados,
        empresaId: empresaPerfil.id,
        salario: dados.salario ? dados.salario : undefined,
        dataExpiracao: new Date(dados.dataExpiracao),
      },
      include: {
        empresa: { include: { usuario: { select: { nome: true } } } },
      },
    });

    return created(res, vaga, "Vaga publicada com sucesso!");
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/vagas/:id
 * Edita vaga (apenas empresa dona - RN16, RN18)
 */
export async function editarVaga(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const vaga = await prisma.vaga.findUnique({
      where: { id },
      include: { empresa: true },
    });

    if (!vaga) return notFound(res, "Vaga não encontrada");

    // Verificar se é a empresa dona (RN16)
    if (vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Você não tem permissão para editar esta vaga");
    }

    // Não pode editar vaga fechada (RN18)
    if (vaga.status === "fechada") {
      return badRequest(res, "Não é possível editar uma vaga fechada");
    }

    const dados = schemaCriarVaga.partial().parse(req.body);

    const vagaAtualizada = await prisma.vaga.update({
      where: { id },
      data: {
        ...dados,
        salario: dados.salario ? dados.salario : undefined,
        dataExpiracao: dados.dataExpiracao ? new Date(dados.dataExpiracao) : undefined,
      },
    });

    return ok(res, vagaAtualizada, "Vaga atualizada com sucesso");
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/vagas/:id
 * Remove vaga (apenas empresa dona - RN16)
 */
export async function deletarVaga(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const vaga = await prisma.vaga.findUnique({
      where: { id },
      include: { empresa: true },
    });

    if (!vaga) return notFound(res, "Vaga não encontrada");

    if (vaga.empresa.usuarioId !== req.user!.userId) {
      return forbidden(res, "Você não tem permissão para deletar esta vaga");
    }

    await prisma.vaga.delete({ where: { id } });

    return ok(res, null, "Vaga removida com sucesso");
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/vagas/empresa/minhas
 * Lista vagas da empresa logada
 */
export async function minhasVagas(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const empresaPerfil = await prisma.perfilEmpresa.findUnique({
      where: { usuarioId: req.user!.userId },
    });

    if (!empresaPerfil) return notFound(res, "Perfil de empresa não encontrado");

    const vagas = await prisma.vaga.findMany({
      where: { empresaId: empresaPerfil.id },
      orderBy: { dataPublicacao: "desc" },
      include: {
        _count: { select: { candidaturas: true } },
        etapas: { orderBy: { ordem: "asc" } },
      },
    });

    return ok(res, vagas);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/vagas/recomendacoes
 * Vagas recomendadas para o universitário logado (RN10, RN11)
 * Matching por: curso, área, localização
 */
export async function recomendacoes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const perfil = await prisma.perfilUniversitario.findUnique({
      where: { usuarioId: req.user!.userId },
    });

    if (!perfil) return notFound(res, "Perfil não encontrado");

    const hoje = new Date();

    // Busca vagas ativas priorizando: curso > localização
    const vagas = await prisma.vaga.findMany({
      where: {
        status: "ativa",
        dataExpiracao: { gte: hoje },
        OR: [
          ...(perfil.curso ? [{ cursoDesejado: { contains: perfil.curso, mode: "insensitive" as const } }] : []),
          ...(perfil.localizacao ? [{ localizacao: { contains: perfil.localizacao, mode: "insensitive" as const } }] : []),
        ],
      },
      take: 20,
      orderBy: { dataPublicacao: "desc" },
      include: {
        empresa: { include: { usuario: { select: { nome: true } } } },
        _count: { select: { candidaturas: true } },
      },
    });

    // Se não encontrou vagas compatíveis, retorna as mais recentes
    if (vagas.length === 0) {
      const vagasRecentes = await prisma.vaga.findMany({
        where: { status: "ativa", dataExpiracao: { gte: hoje } },
        take: 10,
        orderBy: { dataPublicacao: "desc" },
        include: {
          empresa: { include: { usuario: { select: { nome: true } } } },
          _count: { select: { candidaturas: true } },
        },
      });
      return ok(res, vagasRecentes);
    }

    return ok(res, vagas);
  } catch (err) {
    next(err);
  }
}
