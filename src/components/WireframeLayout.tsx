import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import coumtLogo from "@/assets/coumt-logo.jpg";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { estaLogado, usuario, ehUniversitario, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/vagas", label: "Vagas" },
    { to: "/area-universitario", label: "Universitário" },
    { to: "/area-empresa", label: "Empresa" },
  ];

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "";
  const areaLink = ehUniversitario ? "/area-universitario" : "/area-empresa";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={coumtLogo} alt="COUMT" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {estaLogado ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={areaLink}>{primeiroNome}</Link>
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={logout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/cadastro">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border mt-2">
              {estaLogado ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={areaLink} onClick={() => setMenuOpen(false)}>
                      {primeiroNome}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link to="/cadastro" onClick={() => setMenuOpen(false)}>Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src={coumtLogo} alt="COUMT" className="h-8 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                Conectando universitários a oportunidades de estágio obrigatório.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">Plataforma</h4>
              <div className="space-y-2">
                <Link to="/vagas" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Buscar Vagas</Link>
                <Link to="/cadastro" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Cadastre-se</Link>
                <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">Institucional</h4>
              <div className="space-y-2">
                <span className="block text-sm text-muted-foreground">Sobre nós</span>
                <span className="block text-sm text-muted-foreground">Termos de Uso</span>
                <span className="block text-sm text-muted-foreground">Privacidade</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">Contato</h4>
              <div className="space-y-2">
                <span className="block text-sm text-muted-foreground">contato@coumt.com.br</span>
                <span className="block text-sm text-muted-foreground">(11) 3000-0000</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-xs text-muted-foreground">© 2026 COUMT. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
