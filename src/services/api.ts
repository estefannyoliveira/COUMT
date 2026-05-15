// src/services/api.ts
// Serviço central de comunicação com o backend COUMT

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const IS_MOCK = import.meta.env.VITE_MOCK_MODE === "true";

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

// =============================================
// TIPOS
// =============================================

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  tipo: "universitario" | "empresa";
}

export interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  area: string;
  cursoDesejado: string;
  localizacao: string;
  duracaoEstagio: string;
  salario?: number;
  nivel: string;
  status: string;
  dataPublicacao: string;
  dataExpiracao: string;
  empresa?: {
    id: string;
    usuario: { nome: string };
    localizacao?: string;
  };
  etapas?: EtapaProcesso[];
  _count?: { candidaturas: number };
}

export interface EtapaProcesso {
  id: string;
  numeroEtapa: number;
  nomeEtapa: string;
  tipo: string;
  descricao?: string;
  ordem: number;
}

export interface Candidatura {
  id: string;
  dataCandidatura: string;
  statusProcesso: string;
  vaga: {
    id: string;
    titulo: string;
    empresa?: { usuario: { nome: string } };
  };
  etapaAtual?: EtapaProcesso;
}

export interface PerfilUniversitario {
  id: string;
  curso?: string;
  instituicao?: string;
  matricula?: string;
  celular?: string;
  localizacao?: string;
  bio?: string;
  cvUrl?: string;
  usuario: { nome: string; email: string };
}

export interface PerfilEmpresa {
  id: string;
  cnpj?: string;
  descricao?: string;
  localizacao?: string;
  website?: string;
  telefone?: string;
  usuario: { nome: string; email: string };
}

// =============================================
// MOCK DATA
// =============================================

const MOCK_USERS: Record<string, { token: string; usuario: Usuario }> = {
  "aluno@teste.com": {
    token: "mock-token-universitario",
    usuario: { id: "u1", email: "aluno@teste.com", nome: "Ana Silva", tipo: "universitario" },
  },
  "empresa@teste.com": {
    token: "mock-token-empresa",
    usuario: { id: "e1", email: "empresa@teste.com", nome: "TechCorp Ltda", tipo: "empresa" },
  },
};

const MOCK_VAGAS: Vaga[] = [
  {
    id: "v1",
    titulo: "Estágio em Engenharia Civil",
    descricao: "Acompanhamento de obras e projetos de infraestrutura urbana. Apoio na elaboração de projetos, visitas técnicas e relatórios de progresso.",
    area: "Engenharia",
    cursoDesejado: "Engenharia Civil",
    localizacao: "Manaus, AM",
    duracaoEstagio: "6 meses",
    nivel: "Junior",
    status: "ATIVA",
    dataPublicacao: "2026-05-01T00:00:00Z",
    dataExpiracao: "2026-08-01T00:00:00Z",
    empresa: { id: "e1", usuario: { nome: "Construtora Norte S.A." }, localizacao: "Manaus, AM" },
    etapas: [
      { id: "et1", numeroEtapa: 1, nomeEtapa: "Triagem de Currículo", tipo: "TRIAGEM", ordem: 1 },
      { id: "et2", numeroEtapa: 2, nomeEtapa: "Entrevista RH", tipo: "ENTREVISTA", ordem: 2 },
      { id: "et3", numeroEtapa: 3, nomeEtapa: "Entrevista Técnica", tipo: "ENTREVISTA", ordem: 3 },
    ],
    _count: { candidaturas: 12 },
  },
  {
    id: "v2",
    titulo: "Estágio em Administração",
    descricao: "Apoio às áreas de recursos humanos, financeiro e operações. Elaboração de planilhas, relatórios gerenciais e análise de indicadores.",
    area: "Gestão",
    cursoDesejado: "Administração",
    localizacao: "Manaus, AM",
    duracaoEstagio: "12 meses",
    nivel: "Junior",
    status: "ATIVA",
    dataPublicacao: "2026-05-03T00:00:00Z",
    dataExpiracao: "2026-09-03T00:00:00Z",
    empresa: { id: "e2", usuario: { nome: "Grupo Empresarial Amazônia" }, localizacao: "Manaus, AM" },
    etapas: [
      { id: "et4", numeroEtapa: 1, nomeEtapa: "Análise de Currículo", tipo: "TRIAGEM", ordem: 1 },
      { id: "et5", numeroEtapa: 2, nomeEtapa: "Entrevista Final", tipo: "ENTREVISTA", ordem: 2 },
    ],
    _count: { candidaturas: 8 },
  },
  {
    id: "v3",
    titulo: "Estágio em Psicologia Organizacional",
    descricao: "Apoio em processos seletivos, integração de novos colaboradores e desenvolvimento de treinamentos internos.",
    area: "Saúde",
    cursoDesejado: "Psicologia",
    localizacao: "Manaus, AM",
    duracaoEstagio: "6 meses",
    nivel: "Junior",
    status: "ATIVA",
    dataPublicacao: "2026-05-05T00:00:00Z",
    dataExpiracao: "2026-08-05T00:00:00Z",
    empresa: { id: "e3", usuario: { nome: "Clínica Bem Estar" }, localizacao: "Manaus, AM" },
    etapas: [
      { id: "et6", numeroEtapa: 1, nomeEtapa: "Triagem", tipo: "TRIAGEM", ordem: 1 },
      { id: "et7", numeroEtapa: 2, nomeEtapa: "Dinâmica de Grupo", tipo: "DINAMICA", ordem: 2 },
      { id: "et8", numeroEtapa: 3, nomeEtapa: "Entrevista com Gestor", tipo: "ENTREVISTA", ordem: 3 },
    ],
    _count: { candidaturas: 5 },
  },
  {
    id: "v4",
    titulo: "Estágio em Desenvolvimento de Software",
    descricao: "Desenvolvimento de funcionalidades em aplicações web usando React e Node.js. Participação em code reviews e reuniões de sprint.",
    area: "Tecnologia da Informação",
    cursoDesejado: "Ciência da Computação",
    localizacao: "Manaus, AM",
    duracaoEstagio: "12 meses",
    nivel: "Junior",
    status: "ATIVA",
    dataPublicacao: "2026-05-08T00:00:00Z",
    dataExpiracao: "2026-09-08T00:00:00Z",
    empresa: { id: "e1", usuario: { nome: "TechCorp Ltda" }, localizacao: "Manaus, AM" },
    etapas: [
      { id: "et9", numeroEtapa: 1, nomeEtapa: "Teste Técnico", tipo: "TESTE", ordem: 1 },
      { id: "et10", numeroEtapa: 2, nomeEtapa: "Entrevista Técnica", tipo: "ENTREVISTA", ordem: 2 },
    ],
    _count: { candidaturas: 20 },
  },
  {
    id: "v5",
    titulo: "Estágio em Direito Trabalhista",
    descricao: "Apoio na elaboração de contratos, pesquisa jurídica e acompanhamento de processos trabalhistas.",
    area: "Jurídico",
    cursoDesejado: "Direito",
    localizacao: "Manaus, AM",
    duracaoEstagio: "6 meses",
    nivel: "Junior",
    status: "ATIVA",
    dataPublicacao: "2026-05-10T00:00:00Z",
    dataExpiracao: "2026-08-10T00:00:00Z",
    empresa: { id: "e4", usuario: { nome: "Silva & Associados Advocacia" }, localizacao: "Manaus, AM" },
    etapas: [
      { id: "et11", numeroEtapa: 1, nomeEtapa: "Análise de Currículo", tipo: "TRIAGEM", ordem: 1 },
      { id: "et12", numeroEtapa: 2, nomeEtapa: "Entrevista com Sócio", tipo: "ENTREVISTA", ordem: 2 },
    ],
    _count: { candidaturas: 7 },
  },
  {
    id: "v6",
    titulo: "Estágio em Análise de Dados",
    descricao: "Suporte na coleta, tratamento e visualização de dados usando Python e Power BI.",
    area: "Dados e Analytics",
    cursoDesejado: "Sistemas de Informação",
    localizacao: "Manaus, AM",
    duracaoEstagio: "12 meses",
    nivel: "Junior",
    status: "ATIVA",
    dataPublicacao: "2026-05-12T00:00:00Z",
    dataExpiracao: "2026-09-12T00:00:00Z",
    empresa: { id: "e5", usuario: { nome: "DataLab Amazônia" }, localizacao: "Manaus, AM" },
    etapas: [
      { id: "et13", numeroEtapa: 1, nomeEtapa: "Teste de Lógica", tipo: "TESTE", ordem: 1 },
      { id: "et14", numeroEtapa: 2, nomeEtapa: "Entrevista Final", tipo: "ENTREVISTA", ordem: 2 },
    ],
    _count: { candidaturas: 15 },
  },
];

const MOCK_CANDIDATURAS: Candidatura[] = [
  {
    id: "c1",
    dataCandidatura: "2026-05-02T10:00:00Z",
    statusProcesso: "EM_ANDAMENTO",
    vaga: { id: "v1", titulo: "Estágio em Engenharia Civil", empresa: { usuario: { nome: "Construtora Norte S.A." } } },
    etapaAtual: { id: "et2", numeroEtapa: 2, nomeEtapa: "Entrevista RH", tipo: "ENTREVISTA", ordem: 2 },
  },
  {
    id: "c2",
    dataCandidatura: "2026-05-09T14:00:00Z",
    statusProcesso: "PENDENTE",
    vaga: { id: "v4", titulo: "Estágio em Desenvolvimento de Software", empresa: { usuario: { nome: "TechCorp Ltda" } } },
    etapaAtual: { id: "et9", numeroEtapa: 1, nomeEtapa: "Teste Técnico", tipo: "TESTE", ordem: 1 },
  },
];

const MOCK_PERFIL_UNI: PerfilUniversitario = {
  id: "p1",
  curso: "Engenharia Civil",
  instituicao: "FAMETRO",
  matricula: "2022001234",
  celular: "(92) 99999-0001",
  localizacao: "Manaus, AM",
  bio: "Estudante de Engenharia Civil buscando meu primeiro estágio obrigatório.",
  cvUrl: undefined,
  usuario: { nome: "Ana Silva", email: "aluno@teste.com" },
};

const MOCK_PERFIL_EMP: PerfilEmpresa = {
  id: "pe1",
  cnpj: "12.345.678/0001-90",
  descricao: "Empresa de tecnologia focada em soluções para o mercado amazônico.",
  localizacao: "Manaus, AM",
  website: "https://techcorp.com.br",
  telefone: "(92) 3000-0001",
  usuario: { nome: "TechCorp Ltda", email: "empresa@teste.com" },
};

// =============================================
// HELPERS
// =============================================

function getToken(): string | null {
  return localStorage.getItem("coumt_token");
}

function setToken(token: string): void {
  localStorage.setItem("coumt_token", token);
}

function removeToken(): void {
  localStorage.removeItem("coumt_token");
  localStorage.removeItem("coumt_user");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro na requisição");
  }

  return data;
}

// =============================================
// AUTH
// =============================================

export const authService = {
  async registrar(dados: {
    tipo: "universitario" | "empresa";
    nome: string;
    email: string;
    senha: string;
    [key: string]: unknown;
  }) {
    if (IS_MOCK) {
      await delay();
      const usuario: Usuario = {
        id: `mock-${Date.now()}`,
        email: dados.email,
        nome: dados.nome,
        tipo: dados.tipo,
      };
      const token = `mock-token-${dados.tipo}`;
      setToken(token);
      localStorage.setItem("coumt_user", JSON.stringify(usuario));
      return { token, usuario };
    }
    const res = await request<{ data: { token: string; usuario: Usuario } }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(dados) }
    );
    setToken(res.data.token);
    localStorage.setItem("coumt_user", JSON.stringify(res.data.usuario));
    return res.data;
  },

  async login(email: string, senha: string) {
    if (IS_MOCK) {
      await delay();
      const mock = MOCK_USERS[email];
      if (!mock || senha.length < 3) {
        throw new Error("E-mail ou senha inválidos. Use aluno@teste.com ou empresa@teste.com com senha 123456");
      }
      setToken(mock.token);
      localStorage.setItem("coumt_user", JSON.stringify(mock.usuario));
      return mock;
    }
    const res = await request<{ data: { token: string; usuario: Usuario } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, senha }) }
    );
    setToken(res.data.token);
    localStorage.setItem("coumt_user", JSON.stringify(res.data.usuario));
    return res.data;
  },

  logout() {
    removeToken();
  },

  async me() {
    if (IS_MOCK) {
      await delay(100);
      const raw = localStorage.getItem("coumt_user");
      if (!raw) throw new Error("Não autenticado");
      return { data: JSON.parse(raw) as Usuario };
    }
    return request<{ data: Usuario }>("/auth/me");
  },

  getUsuarioLocal(): Usuario | null {
    const raw = localStorage.getItem("coumt_user");
    return raw ? JSON.parse(raw) : null;
  },

  estaLogado(): boolean {
    return !!getToken();
  },
};

// =============================================
// VAGAS
// =============================================

export const vagasService = {
  async listar(filtros?: {
    area?: string;
    localizacao?: string;
    cursoDesejado?: string;
    nivel?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    if (IS_MOCK) {
      await delay();
      let resultado = [...MOCK_VAGAS];
      if (filtros?.area) resultado = resultado.filter((v) => v.area === filtros.area);
      if (filtros?.cursoDesejado) resultado = resultado.filter((v) => v.cursoDesejado === filtros.cursoDesejado);
      if (filtros?.localizacao) resultado = resultado.filter((v) => v.localizacao.includes(filtros.localizacao!));
      if (filtros?.search) {
        const q = filtros.search.toLowerCase();
        resultado = resultado.filter(
          (v) => v.titulo.toLowerCase().includes(q) || v.area.toLowerCase().includes(q)
        );
      }
      return { data: resultado, pagination: { total: resultado.length, page: 1, limit: 20 } };
    }
    const params = new URLSearchParams(
      Object.entries(filtros || {})
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    );
    return request<{ data: Vaga[]; pagination: unknown }>(`/vagas?${params}`);
  },

  async buscarPorId(id: string) {
    if (IS_MOCK) {
      await delay();
      const vaga = MOCK_VAGAS.find((v) => v.id === id);
      if (!vaga) throw new Error("Vaga não encontrada");
      return { data: vaga };
    }
    return request<{ data: Vaga }>(`/vagas/${id}`);
  },

  async criar(dados: unknown) {
    if (IS_MOCK) {
      await delay();
      return { data: { ...MOCK_VAGAS[0], id: `v-${Date.now()}`, ...(dados as object) } as Vaga };
    }
    return request<{ data: Vaga }>("/vagas", { method: "POST", body: JSON.stringify(dados) });
  },

  async editar(id: string, dados: unknown) {
    if (IS_MOCK) {
      await delay();
      const vaga = MOCK_VAGAS.find((v) => v.id === id) ?? MOCK_VAGAS[0];
      return { data: { ...vaga, ...(dados as object) } as Vaga };
    }
    return request<{ data: Vaga }>(`/vagas/${id}`, { method: "PUT", body: JSON.stringify(dados) });
  },

  async deletar(id: string) {
    if (IS_MOCK) { await delay(); return { success: true }; }
    return request<{ success: boolean }>(`/vagas/${id}`, { method: "DELETE" });
  },

  async minhasVagas() {
    if (IS_MOCK) {
      await delay();
      return { data: MOCK_VAGAS.slice(0, 3) };
    }
    return request<{ data: Vaga[] }>("/vagas/empresa/minhas");
  },

  async candidaturasDaVaga(vagaId: string) {
    if (IS_MOCK) {
      await delay();
      return {
        data: [
          { id: "c1", universitario: { usuario: { nome: "Ana Silva" } }, statusProcesso: "EM_ANDAMENTO", dataCandidatura: "2026-05-02T10:00:00Z" },
          { id: "c3", universitario: { usuario: { nome: "Carlos Mendes" } }, statusProcesso: "PENDENTE", dataCandidatura: "2026-05-04T09:00:00Z" },
        ],
      };
    }
    return request<{ data: unknown[] }>(`/vagas/${vagaId}/candidaturas`);
  },
};

// =============================================
// CANDIDATURAS
// =============================================

export const candidaturasService = {
  async candidatar(vagaId: string) {
    if (IS_MOCK) {
      await delay();
      const vaga = MOCK_VAGAS.find((v) => v.id === vagaId) ?? MOCK_VAGAS[0];
      return {
        data: {
          id: `c-${Date.now()}`,
          dataCandidatura: new Date().toISOString(),
          statusProcesso: "PENDENTE",
          vaga: { id: vaga.id, titulo: vaga.titulo, empresa: vaga.empresa },
        } as Candidatura,
      };
    }
    return request<{ data: Candidatura }>("/candidaturas", { method: "POST", body: JSON.stringify({ vagaId }) });
  },

  async minhasCandidaturas() {
    if (IS_MOCK) {
      await delay();
      return { data: MOCK_CANDIDATURAS };
    }
    return request<{ data: Candidatura[] }>("/candidaturas/minhas");
  },

  async cancelar(id: string) {
    if (IS_MOCK) { await delay(); return { success: true }; }
    return request<{ success: boolean }>(`/candidaturas/${id}`, { method: "DELETE" });
  },

  async atualizarStatus(id: string, statusProcesso: string, etapaAtualId?: string) {
    if (IS_MOCK) {
      await delay();
      const c = MOCK_CANDIDATURAS.find((c) => c.id === id) ?? MOCK_CANDIDATURAS[0];
      return { data: { ...c, statusProcesso } as Candidatura };
    }
    return request<{ data: Candidatura }>(`/candidaturas/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ statusProcesso, etapaAtualId }),
    });
  },
};

// =============================================
// NOTIFICAÇÕES
// =============================================

export const notificacoesService = {
  async listar() {
    if (IS_MOCK) {
      await delay();
      return {
        data: {
          notificacoes: [
            { id: "n1", mensagem: "Sua candidatura para Estágio em Engenharia Civil avançou para Entrevista RH.", lida: false, createdAt: "2026-05-10T08:00:00Z" },
            { id: "n2", mensagem: "Nova vaga compatível com seu perfil: Estágio em Análise de Dados.", lida: true, createdAt: "2026-05-09T12:00:00Z" },
          ],
          naoLidas: 1,
        },
      };
    }
    return request<{ data: { notificacoes: unknown[]; naoLidas: number } }>("/notificacoes");
  },

  async marcarComoLida(id: string) {
    if (IS_MOCK) { await delay(100); return { success: true }; }
    return request<{ success: boolean }>(`/notificacoes/${id}/lido`, { method: "PATCH" });
  },
};

// =============================================
// PERFIL
// =============================================

export const perfilService = {
  async meuPerfil() {
    if (IS_MOCK) {
      await delay();
      const raw = localStorage.getItem("coumt_user");
      const user: Usuario | null = raw ? JSON.parse(raw) : null;
      if (user?.tipo === "empresa") return { data: MOCK_PERFIL_EMP as PerfilEmpresa };
      return { data: MOCK_PERFIL_UNI as PerfilUniversitario };
    }
    return request<{ data: PerfilUniversitario | PerfilEmpresa }>("/perfil/me");
  },

  async atualizarUniversitario(dados: unknown) {
    if (IS_MOCK) {
      await delay();
      return { data: { ...MOCK_PERFIL_UNI, ...(dados as object) } as PerfilUniversitario };
    }
    return request<{ data: PerfilUniversitario }>("/perfil/universitario", { method: "PUT", body: JSON.stringify(dados) });
  },

  async atualizarEmpresa(dados: unknown) {
    if (IS_MOCK) {
      await delay();
      return { data: { ...MOCK_PERFIL_EMP, ...(dados as object) } as PerfilEmpresa };
    }
    return request<{ data: PerfilEmpresa }>("/perfil/empresa", { method: "PUT", body: JSON.stringify(dados) });
  },
};

// =============================================
// CHAT
// =============================================

export const chatService = {
  async listarMensagens(candidaturaId: string) {
    if (IS_MOCK) {
      await delay();
      return {
        data: [
          { id: "m1", conteudo: "Olá! Gostaríamos de agendar sua entrevista para sexta-feira às 14h.", remetente: "empresa", createdAt: "2026-05-10T09:00:00Z" },
          { id: "m2", conteudo: "Olá! Claro, estarei disponível nesse horário. Obrigada!", remetente: "universitario", createdAt: "2026-05-10T09:15:00Z" },
        ],
      };
    }
    return request<{ data: unknown[] }>(`/chat/${candidaturaId}`);
  },

  async enviarMensagem(candidaturaId: string, conteudo: string) {
    if (IS_MOCK) {
      await delay(200);
      return { data: { id: `m-${Date.now()}`, conteudo, remetente: "universitario", createdAt: new Date().toISOString() } };
    }
    return request<{ data: unknown }>(`/chat/${candidaturaId}/mensagens`, { method: "POST", body: JSON.stringify({ conteudo }) });
  },
};
