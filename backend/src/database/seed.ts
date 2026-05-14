// src/database/seed.ts
// Script para popular o banco com dados de teste
// Execute com: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...\n");

  const senhaHash = await bcrypt.hash("senha123", 12);

  // ---- Criar universitário de teste ----
  const univUsuario = await prisma.usuario.upsert({
    where: { email: "aluno@teste.com" },
    update: {},
    create: {
      email: "aluno@teste.com",
      senhaHash,
      tipo: "universitario",
      nome: "João Silva",
      perfilUniversitario: {
        create: {
          celular: "(92) 99999-1111",
          curso: "Ciência da Computação",
          instituicao: "UFAM",
          localizacao: "Manaus, AM",
          matricula: "2021001234",
          bio: "Estudante de Computação apaixonado por desenvolvimento web.",
        },
      },
    },
  });
  console.log(`✅ Universitário criado: ${univUsuario.email}`);

  // ---- Criar empresa de teste ----
  const empresaUsuario = await prisma.usuario.upsert({
    where: { email: "empresa@teste.com" },
    update: {},
    create: {
      email: "empresa@teste.com",
      senhaHash,
      tipo: "empresa",
      nome: "TechAmazon S.A.",
      perfilEmpresa: {
        create: {
          cnpj: "12.345.678/0001-99",
          descricao: "Empresa de tecnologia focada em soluções para a Amazônia.",
          localizacao: "Manaus, AM",
          website: "https://techamazon.com.br",
          telefone: "(92) 3333-4444",
        },
      },
    },
  });
  console.log(`✅ Empresa criada: ${empresaUsuario.email}`);

  // ---- Buscar perfil da empresa ----
  const perfilEmpresa = await prisma.perfilEmpresa.findUnique({
    where: { usuarioId: empresaUsuario.id },
  });

  // ---- Criar vagas de teste ----
  const vaga1 = await prisma.vaga.create({
    data: {
      empresaId: perfilEmpresa!.id,
      titulo: "Estágio em Desenvolvimento Web",
      descricao: "Buscamos estagiário para atuar no desenvolvimento de aplicações web com React e Node.js. Você irá trabalhar em um ambiente ágil, participando de sprints e contribuindo com código de qualidade.",
      area: "Tecnologia da Informação",
      cursoDesejado: "Ciência da Computação",
      localizacao: "Manaus, AM",
      duracaoEstagio: "12 meses",
      salario: 1200.00,
      nivel: "iniciante",
      dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      etapas: {
        create: [
          { numeroEtapa: 1, nomeEtapa: "Análise de Currículo", tipo: "analise", ordem: 1, descricao: "Avaliação do perfil e experiências" },
          { numeroEtapa: 2, nomeEtapa: "Teste Técnico", tipo: "teste", ordem: 2, descricao: "Teste de lógica e programação" },
          { numeroEtapa: 3, nomeEtapa: "Entrevista Final", tipo: "entrevista", ordem: 3, descricao: "Entrevista com a equipe técnica" },
        ],
      },
    },
  });

  await prisma.vaga.create({
    data: {
      empresaId: perfilEmpresa!.id,
      titulo: "Estágio em Análise de Dados",
      descricao: "Oportunidade para estudantes interessados em ciência de dados, análise estatística e visualização de informações.",
      area: "Dados e Analytics",
      cursoDesejado: "Sistemas de Informação",
      localizacao: "Manaus, AM",
      duracaoEstagio: "6 meses",
      salario: 1000.00,
      nivel: "iniciante",
      dataExpiracao: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 dias
    },
  });

  console.log(`✅ 2 vagas criadas`);
  console.log(`✅ 3 etapas criadas para vaga de Dev Web\n`);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Seed concluído com sucesso!\n");
  console.log("📧 Credenciais de teste:");
  console.log("   Universitário: aluno@teste.com / senha123");
  console.log("   Empresa:       empresa@teste.com / senha123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
