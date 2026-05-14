import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, Download, Eye, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const GerenciarCandidatos = () => {
  const { vagaId } = useParams();

  const candidatos = [
    { id: 1, nome: "João da Silva", curso: "Engenharia Civil", universidade: "UFMG", semestre: "9º", etapa: "Entrevista com RH", data: "02/03/2026", iniciais: "JS" },
    { id: 2, nome: "Maria Santos", curso: "Engenharia Civil", universidade: "USP", semestre: "8º", etapa: "Análise curricular", data: "01/03/2026", iniciais: "MS" },
    { id: 3, nome: "Pedro Oliveira", curso: "Engenharia Civil", universidade: "UNICAMP", semestre: "10º", etapa: "Entrevista técnica", data: "28/02/2026", iniciais: "PO" },
    { id: 4, nome: "Ana Souza", curso: "Engenharia Civil", universidade: "UFRJ", semestre: "9º", etapa: "Análise curricular", data: "27/02/2026", iniciais: "AS" },
  ];

  const etapas = ["Análise curricular", "Entrevista com RH", "Entrevista técnica", "Resultado final"];

  const etapaColor = (etapa: string) => {
    const map: Record<string, string> = {
      "Análise curricular": "bg-secondary text-secondary-foreground",
      "Entrevista com RH": "bg-primary/10 text-primary",
      "Entrevista técnica": "bg-accent/10 text-accent",
      "Resultado final": "bg-success/10 text-success",
    };
    return map[etapa] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/area-empresa" className="flex items-center gap-1 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar para Área da Empresa
        </Link>
      </Button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">Vaga #{vagaId}</Badge>
          <h1 className="font-display font-bold text-3xl text-foreground">Gerenciar Candidatos</h1>
          <p className="text-muted-foreground mt-1">Estágio em Engenharia Civil — {candidatos.length} candidatos</p>
        </div>
        <Select>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filtrar por etapa" /></SelectTrigger>
          <SelectContent>
            {etapas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {etapas.map((etapa) => {
          const count = candidatos.filter((c) => c.etapa === etapa).length;
          return (
            <Card key={etapa} className="text-center">
              <CardContent className="p-5 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{etapa}</p>
                <p className="text-3xl font-display font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground">candidato(s)</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Candidates list */}
      <div className="space-y-4">
        <h2 className="font-display font-semibold text-lg text-foreground">Lista de Candidatos</h2>
        {candidatos.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{c.iniciais}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-semibold text-foreground">{c.nome}</p>
                    <Badge className={etapaColor(c.etapa) + " border-0"}>{c.etapa}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {c.curso} — {c.universidade} — {c.semestre} semestre
                  </p>
                  <p className="text-xs text-muted-foreground">Candidatura em: {c.data}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2">
                <Button size="sm"><Eye className="w-4 h-4 mr-1" /> Ver Perfil</Button>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Currículo</Button>
                <Select>
                  <SelectTrigger className="w-[180px] h-9 text-xs"><SelectValue placeholder="Mover para etapa..." /></SelectTrigger>
                  <SelectContent>
                    {etapas.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><UserX className="w-4 h-4 mr-1" /> Reprovar</Button>
                <Button variant="default" size="sm" className="bg-success hover:bg-success/90"><UserCheck className="w-4 h-4 mr-1" /> Aprovar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GerenciarCandidatos;
