import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Clock, Calendar, Users, CheckCircle2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { vagasService, candidaturasService, Vaga } from "@/services/api";

const DetalhesVaga = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario, ehUniversitario } = useAuth();
  const { toast } = useToast();

  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [candidatando, setCandidatando] = useState(false);
  const [jaCandidatou, setJaCandidatou] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (!id) return;
      try {
        const res = await vagasService.buscarPorId(id);
        setVaga(res.data);
      } catch {
        // vaga não encontrada
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function handleCandidatar() {
    if (!id) return;
    setCandidatando(true);
    try {
      await candidaturasService.candidatar(id);
      setJaCandidatou(true);
      toast({ title: "Candidatura enviada com sucesso!" });
    } catch (err) {
      toast({
        title: "Erro ao candidatar",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setCandidatando(false);
    }
  }

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">Carregando vaga...</p>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Vaga não encontrada.</p>
        <Button asChild className="mt-4"><Link to="/vagas">Ver todas as vagas</Link></Button>
      </div>
    );
  }

  const requisitos = vaga.descricao.includes("Requisitos:")
    ? vaga.descricao.split("Requisitos:")[1].trim().split("\n").filter(Boolean)
    : [];
  const descricaoPrincipal = vaga.descricao.includes("Requisitos:")
    ? vaga.descricao.split("Requisitos:")[0].trim()
    : vaga.descricao;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/vagas" className="flex items-center gap-1 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar para vagas
        </Link>
      </Button>

      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <Badge variant="secondary" className="mb-2">{vaga.area}</Badge>
                  <h1 className="font-display font-bold text-2xl text-foreground">{vaga.titulo}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" /> {vaga.empresa?.usuario?.nome || "Empresa"}
                    <span>•</span>
                    <MapPin className="w-4 h-4" /> {vaga.localizacao}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>{vaga.cursoDesejado}</Badge>
                <Badge variant="outline">{vaga.nivel}</Badge>
                {vaga.salario && (
                  <Badge variant="outline">R$ {Number(vaga.salario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Descrição da Vaga</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {descricaoPrincipal.split("\n").map((p, i) => <p key={i}>{p}</p>)}
              {vaga.duracaoEstagio && <p>Duração: {vaga.duracaoEstagio}</p>}
            </CardContent>
          </Card>

          {requisitos.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="font-display text-lg">Requisitos</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requisitos.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {vaga.etapas && vaga.etapas.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="font-display text-lg">Etapas do Processo Seletivo</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaga.etapas
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((etapa) => (
                      <div key={etapa.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {etapa.numeroEtapa}
                        </div>
                        <div>
                          <span className="text-sm text-foreground">{etapa.nomeEtapa}</span>
                          {etapa.descricao && (
                            <p className="text-xs text-muted-foreground">{etapa.descricao}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg gradient-hero text-primary-foreground">
            <CardContent className="p-6 text-center space-y-4">
              <Briefcase className="w-10 h-10 mx-auto opacity-80" />
              <h3 className="font-display font-bold text-lg">Interessado?</h3>
              <p className="text-sm opacity-80">Candidate-se agora e dê o primeiro passo na sua carreira.</p>
              {jaCandidatou ? (
                <Button variant="secondary" size="lg" className="w-full font-semibold" disabled>
                  Candidatura enviada!
                </Button>
              ) : ehUniversitario ? (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full font-semibold"
                  onClick={handleCandidatar}
                  disabled={candidatando}
                >
                  {candidatando ? "Enviando..." : "Candidatar-se"}
                </Button>
              ) : (
                <>
                  <Button variant="secondary" size="lg" className="w-full font-semibold" asChild>
                    <Link to="/login">Entrar para candidatar</Link>
                  </Button>
                  <p className="text-xs opacity-60">Necessário estar logado como universitário</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Informações</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" /> Publicada em: {new Date(vaga.dataPublicacao).toLocaleDateString("pt-BR")}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" /> Encerramento: {new Date(vaga.dataExpiracao).toLocaleDateString("pt-BR")}
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" /> {vaga._count?.candidaturas ?? 0} candidatura(s)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetalhesVaga;
