import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Rota não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-display font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">Página não encontrada</p>
        <Button asChild>
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
