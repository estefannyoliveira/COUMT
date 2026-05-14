import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService, Usuario } from "@/services/api";

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  estaLogado: boolean;
  ehUniversitario: boolean;
  ehEmpresa: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (dados: {
    tipo: "universitario" | "empresa";
    nome: string;
    email: string;
    senha: string;
    [key: string]: unknown;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function verificarAuth() {
      if (!authService.estaLogado()) {
        setCarregando(false);
        return;
      }
      try {
        const res = await authService.me();
        setUsuario(res.data);
        localStorage.setItem("coumt_user", JSON.stringify(res.data));
      } catch {
        authService.logout();
      } finally {
        setCarregando(false);
      }
    }
    verificarAuth();
  }, []);

  async function login(email: string, senha: string) {
    const dados = await authService.login(email, senha);
    setUsuario(dados.usuario);
    if (dados.usuario.tipo === "universitario") {
      navigate("/area-universitario");
    } else {
      navigate("/area-empresa");
    }
  }

  async function registrar(dados: {
    tipo: "universitario" | "empresa";
    nome: string;
    email: string;
    senha: string;
    [key: string]: unknown;
  }) {
    const resultado = await authService.registrar(dados);
    setUsuario(resultado.usuario);
    if (resultado.usuario.tipo === "universitario") {
      navigate("/area-universitario");
    } else {
      navigate("/area-empresa");
    }
  }

  function logout() {
    authService.logout();
    setUsuario(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        registrar,
        logout,
        estaLogado: !!usuario,
        ehUniversitario: usuario?.tipo === "universitario",
        ehEmpresa: usuario?.tipo === "empresa",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
