// src/controllers/authController.ts
// Lógica de negócio para autenticação (registro, login, logout, me)

import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../database/prisma.js";
import { gerarToken } from "../utils/jwt.js";
import { ok, created, badRequest, conflict, serverError, unauthorized } from "../utils/response.js";
import { AuthRequest } from "../types/index.js";

// =============================================
// SCHEMAS DE VALIDAÇÃO
// =============================================

const schemaRegistroUniversitario = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  celular: z.string().optional(),
  dataNascimento: z.string().optional(),
  genero: z.string().optional(),
  cpf: z.string().optional(),
  localizacao: z.string().optional(),
  matricula: z.string().optional(),
  curso: z.string().optional(),
  instituicao: z.string().optional(),
});

const schemaRegistroEmpresa = z.object({
  nome: z.string().min(2, "Nome da empresa deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  cnpj: z.string().optional(),
  descricao: z.string().optional(),
  localizacao: z.string().optional(),
  website: z.string().url("Website inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
});

const schemaLogin = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

// =============================================
// CONTROLLERS
// =============================================

/**
 * POST /api/auth/register
 * Registra novo usuário (universitário ou empresa)
 */
export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { tipo } = req.body;

    if (!tipo || !["universitario", "empresa"].includes(tipo)) {
      return badRequest(res, "Tipo de usuário inválido. Use 'universitario' ou 'empresa'");
    }

    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");

    if (tipo === "universitario") {
      const dados = schemaRegistroUniversitario.parse(req.body);

      // Verificar e-mail único (RN04)
      const emailExistente = await prisma.usuario.findUnique({
        where: { email: dados.email },
      });
      if (emailExistente) {
        return conflict(res, "E-mail já cadastrado");
      }

      // Verificar CPF único
      if (dados.cpf) {
        const cpfExistente = await prisma.perfilUniversitario.findUnique({
          where: { cpf: dados.cpf },
        });
        if (cpfExistente) {
          return conflict(res, "CPF já cadastrado");
        }
      }

      const senhaHash = await bcrypt.hash(dados.senha, bcryptRounds);

      const usuario = await prisma.usuario.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          senhaHash,
          tipo: "universitario",
          perfilUniversitario: {
            create: {
              celular: dados.celular,
              dataNascimento: dados.dataNascimento ? new Date(dados.dataNascimento) : undefined,
              genero: dados.genero,
              cpf: dados.cpf,
              localizacao: dados.localizacao,
              matricula: dados.matricula,
              curso: dados.curso,
              instituicao: dados.instituicao,
            },
          },
        },
        include: { perfilUniversitario: true },
      });

      const token = gerarToken({ userId: usuario.id, email: usuario.email, tipo: "universitario" });

      return created(res, {
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
          perfil: usuario.perfilUniversitario,
        },
      }, "Cadastro realizado com sucesso!");
    }

    // tipo === 'empresa'
    const dados = schemaRegistroEmpresa.parse(req.body);

    const emailExistente = await prisma.usuario.findUnique({
      where: { email: dados.email },
    });
    if (emailExistente) {
      return conflict(res, "E-mail já cadastrado");
    }

    if (dados.cnpj) {
      const cnpjExistente = await prisma.perfilEmpresa.findUnique({
        where: { cnpj: dados.cnpj },
      });
      if (cnpjExistente) {
        return conflict(res, "CNPJ já cadastrado");
      }
    }

    const senhaHash = await bcrypt.hash(dados.senha, bcryptRounds);

    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senhaHash,
        tipo: "empresa",
        perfilEmpresa: {
          create: {
            cnpj: dados.cnpj,
            descricao: dados.descricao,
            localizacao: dados.localizacao,
            website: dados.website || null,
            telefone: dados.telefone,
          },
        },
      },
      include: { perfilEmpresa: true },
    });

    const token = gerarToken({ userId: usuario.id, email: usuario.email, tipo: "empresa" });

    return created(res, {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        perfil: usuario.perfilEmpresa,
      },
    }, "Cadastro realizado com sucesso!");
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Autentica o usuário e retorna JWT
 */
export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, senha } = schemaLogin.parse(req.body);

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        perfilUniversitario: true,
        perfilEmpresa: true,
      },
    });

    if (!usuario) {
      return unauthorized(res, "E-mail ou senha incorretos");
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaCorreta) {
      return unauthorized(res, "E-mail ou senha incorretos");
    }

    const token = gerarToken({
      userId: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo as "universitario" | "empresa",
    });

    const perfil =
      usuario.tipo === "universitario"
        ? usuario.perfilUniversitario
        : usuario.perfilEmpresa;

    return ok(res, {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        perfil,
      },
    }, "Login realizado com sucesso!");
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Retorna dados do usuário logado
 */
export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        perfilUniversitario: true,
        perfilEmpresa: true,
      },
    });

    if (!usuario) {
      return unauthorized(res, "Usuário não encontrado");
    }

    const perfil =
      usuario.tipo === "universitario"
        ? usuario.perfilUniversitario
        : usuario.perfilEmpresa;

    return ok(res, {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      criadoEm: usuario.criadoEm,
      perfil,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Logout (o cliente deve descartar o token)
 */
export async function logout(_req: AuthRequest, res: Response) {
  return ok(res, null, "Logout realizado com sucesso");
}
