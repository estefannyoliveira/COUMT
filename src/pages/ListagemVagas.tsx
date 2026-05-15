import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Building2, MapPin, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vagasService, Vaga } from "@/services/api";

const ListagemVagas = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [search, setSearch] = useState("");
  const [curso, setCurso] = useState("");
  const [area, setArea] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  async function buscar() {
    setCarregando(true);
    try {
      const res = await vagasService.listar({
        search: search || undefined,
        cursoDesejado: curso || undefined,
        area: area || undefined,
        localizacao: localizacao || undefined,
      });
      setVagas(res.data);
    } catch {
      // mantém lista vazia em caso de erro
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscar();
  }, []);

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    buscar();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-foreground">Vagas de Estágio</h1>
        <p className="text-muted-foreground mt-1">Encontre a oportunidade perfeita para seu estágio obrigatório</p>
      </div>

      {/* SEARCH & FILTERS */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-5 space-y-4">
          <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vagas..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit"><Filter className="w-4 h-4 mr-2" /> Buscar</Button>
          </form>
          <div className="flex flex-wrap gap-3">
            <Select
              value={curso || "all"}
              onValueChange={(v) => setCurso(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Curso" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                <SelectItem value="Engenharia Civil">Engenharia Civil</SelectItem>
                <SelectItem value="Administração">Administração</SelectItem>
                <SelectItem value="Psicologia">Psicologia</SelectItem>
                <SelectItem value="Direito">Direito</SelectItem>
                <SelectItem value="Ciência da Computação">Ciência da Computação</SelectItem>
                <SelectItem value="Sistemas de Informação">Sistemas de Informação</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={area || "all"}
              onValueChange={(v) => setArea(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Área" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="Tecnologia da Informação">Tecnologia</SelectItem>
                <SelectItem value="Dados e Analytics">Dados</SelectItem>
                <SelectItem value="Engenharia">Engenharia</SelectItem>
                <SelectItem value="Gestão">Gestão</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Jurídico">Jurídico</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={localizacao || "all"}
              onValueChange={(v) => setLocalizacao(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Localização" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer local</SelectItem>
                <SelectItem value="Manaus">Manaus, AM</SelectItem>
                <SelectItem value="São Paulo">São Paulo</SelectItem>
                <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            {carregando ? "Buscando..." : `${vagas.length} vaga${vagas.length !== 1 ? "s" : ""} encontrada${vagas.length !== 1 ? "s" : ""}`}
          </p>
        </CardContent>
      </Card>

      {/* LIST */}
      <div className="space-y-3">
        {carregando ? (
          <p className="text-muted-foreground text-center py-8">Carregando vagas...</p>
        ) : vagas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhuma vaga encontrada com os filtros selecionados.
            </CardContent>
          </Card>
        ) : (
          vagas.map((vaga) => (
            <Link to={`/vaga/${vaga.id}`} key={vaga.id}>
              <Card className="hover:shadow-md hover:border-primary/30 transition-all group mb-3">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{vaga.titulo}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {vaga.empresa?.usuario?.nome || "Empresa"}
                      <span className="mx-1">•</span>
                      <MapPin className="w-3 h-3" /> {vaga.localizacao}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">{vaga.cursoDesejado}</Badge>
                      <Badge variant="outline" className="text-xs">{vaga.area}</Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" /> {new Date(vaga.dataPublicacao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ListagemVagas;
