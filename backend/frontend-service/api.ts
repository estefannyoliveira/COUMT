// frontend/src/services/api.ts
// Serviço central de comunicação com o backend COUMT
// Coloque este arquivo em: src/services/api.ts no seu projeto frontend

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

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
    const res = await request<{ data: { token: string; usuario: unknown } }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(dados) }
    );
    setToken(res.data.token);
    localStorage.setItem("coumt_user", JSON.stringify(res.data.usuario));
    return res.data;
  },

  async login(email: string, senha: string) {
    const res = await request<{ data: { token: string; usuario: unknown } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, senha }) }
    );
    setToken(res.data.token);
    localStorage.setItem("coumt_user", JSON.stringify(res.data.usuario));
    return res.data;
  },

  async logout() {
    await request("/auth/logout", { method: "POST" });
    removeToken();
  },

  async me() {
    return request<{ data: unknown }>("/auth/me");
  },

  getUsuarioLocal() {
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
    const params = new URLSearchParams(
      Object.entries(filtros || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );
    return request<{ data: unknown[]; pagination: unknown }>(`/vagas?${params}`);
  },

  async buscarPorId(id: string) {
    return request<{ data: unknown }>(`/vagas/${id}`);
  },

  async criar(dados: unknown) {
    return request<{ data: unknown }>("/vagas", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  async editar(id: string, dados: unknown) {
    return request<{ data: unknown }>(`/vagas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  async deletar(id: string) {
    return request<{ success: boolean }>(`/vagas/${id}`, { method: "DELETE" });
  },

  async minhasVagas() {
    return request<{ data: unknown[] }>("/vagas/empresa/minhas");
  },

  async recomendacoes() {
    return request<{ data: unknown[] }>("/vagas/recomendacoes");
  },

  async candidaturasDaVaga(vagaId: string) {
    return request<{ data: unknown[] }>(`/vagas/${vagaId}/candidaturas`);
  },
};

// =============================================
// CANDIDATURAS
// =============================================

export const candidaturasService = {
  async candidatar(vagaId: string) {
    return request<{ data: unknown }>("/candidaturas", {
      method: "POST",
      body: JSON.stringify({ vagaId }),
    });
  },

  async minhasCandidaturas() {
    return request<{ data: unknown[] }>("/candidaturas/minhas");
  },

  async cancelar(id: string) {
    return request<{ success: boolean }>(`/candidaturas/${id}`, {
      method: "DELETE",
    });
  },

  async atualizarStatus(
    id: string,
    statusProcesso: string,
    etapaAtualId?: string
  ) {
    return request<{ data: unknown }>(`/candidaturas/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ statusProcesso, etapaAtualId }),
    });
  },
};

// =============================================
// CHAT
// =============================================

export const chatService = {
  async listarMensagens(candidaturaId: string) {
    return request<{ data: unknown[] }>(`/chat/${candidaturaId}`);
  },

  async enviarMensagem(candidaturaId: string, conteudo: string) {
    return request<{ data: unknown }>(`/chat/${candidaturaId}/mensagens`, {
      method: "POST",
      body: JSON.stringify({ conteudo }),
    });
  },
};

// =============================================
// NOTIFICAÇÕES
// =============================================

export const notificacoesService = {
  async listar() {
    return request<{ data: { notificacoes: unknown[]; naoLidas: number } }>(
      "/notificacoes"
    );
  },

  async marcarComoLida(id: string) {
    return request<{ success: boolean }>(`/notificacoes/${id}/lido`, {
      method: "PATCH",
    });
  },

  async lerTodas() {
    return request<{ success: boolean }>("/notificacoes/ler-todas", {
      method: "PATCH",
    });
  },
};

// =============================================
// PERFIL
// =============================================

export const perfilService = {
  async meuPerfil() {
    return request<{ data: unknown }>("/perfil/me");
  },

  async atualizarUniversitario(dados: unknown) {
    return request<{ data: unknown }>("/perfil/universitario", {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  async atualizarEmpresa(dados: unknown) {
    return request<{ data: unknown }>("/perfil/empresa", {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },
};
