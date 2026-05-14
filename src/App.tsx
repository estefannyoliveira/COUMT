import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import WireframeLayout from "./components/WireframeLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ListagemVagas from "./pages/ListagemVagas";
import DetalhesVaga from "./pages/DetalhesVaga";
import AreaUniversitario from "./pages/AreaUniversitario";
import AreaEmpresa from "./pages/AreaEmpresa";
import GerenciarCandidatos from "./pages/GerenciarCandidatos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PrivateRoute({ children, tipo }: { children: ReactNode; tipo?: "universitario" | "empresa" }) {
  const { estaLogado, ehUniversitario, ehEmpresa, carregando } = useAuth();

  if (carregando) return null;
  if (!estaLogado) return <Navigate to="/login" replace />;
  if (tipo === "universitario" && !ehUniversitario) return <Navigate to="/area-empresa" replace />;
  if (tipo === "empresa" && !ehEmpresa) return <Navigate to="/area-universitario" replace />;

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WireframeLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Login />} />
              <Route path="/vagas" element={<ListagemVagas />} />
              <Route path="/vaga/:id" element={<DetalhesVaga />} />
              <Route
                path="/area-universitario"
                element={
                  <PrivateRoute tipo="universitario">
                    <AreaUniversitario />
                  </PrivateRoute>
                }
              />
              <Route
                path="/area-empresa"
                element={
                  <PrivateRoute tipo="empresa">
                    <AreaEmpresa />
                  </PrivateRoute>
                }
              />
              <Route
                path="/gerenciar-candidatos/:vagaId"
                element={
                  <PrivateRoute tipo="empresa">
                    <GerenciarCandidatos />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WireframeLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
