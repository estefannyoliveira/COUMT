import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, FileText, Edit, LogOut, Upload, Eye, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { perfilService, candidaturasService, PerfilUniversitario, Candidatura } from "@/services/api";

const statusLabel: Record<string, { label: string; color: string }> = {
  inscrito:     { label: "Inscrito",             color: "bg-secondary/80 text-secondary-foreground" },
  em_analise:   { label: "Em análise",            color: "bg-warning/10 text-warning" },
  entrevista:   { label: "Entrevista agendada",   color: "bg-primary/10 text-primary" },
  aprovado:     { label: "Aprovado",              color: "bg-success/10 text-success" },
  rejeitado:    { label: "Não selecionado",       color: "bg-destructive/10 text-destructive" },
};

const AreaUniversitario = () => {
  const { usuario, logout } = useAuth();
  const { toast } = useToast();

  const [perfil, setPerfil] = useState<PerfilUniversitario | null>(null);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Campos do formulário de edição
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [universidade, setUniversidade] = useState("");
  const [curso, setCurso] = useState("");
  const [semestre, setSemestre] = useState("");
  const [celular, setCelular] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [resPerfil, resCandidaturas] = await Promise.all([
          perfilService.meuPerfil(),
          candidaturasService.minhasCandidaturas(),
        ]);
        const p = resPerfil.data as PerfilUniversitario;
        setPerfil(p);
        setCandidaturas(resCandidaturas.data);

        // Preenche formulário
        setNome(p.usuario?.nome || "");
        setEmail(p.usuario?.email || "");
        setUniversidade(p.instituicao || "");
        setCurso(p.curso || "");
        setSemestre(""); // backend não retorna semestre formatado
        setCelular(p.celular || "");
      } catch {
        toast({ title: "Erro ao carregar perfil", variant: "destructive" });
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [toast]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await perfilService.atualizarUniversitario({
        celular,
        curso,
        instituicao: universidade,
      });
      toast({ title: "Dados atualizados com sucesso!" });
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  }

  async function handleCancelarCandidatura(id: string) {
    try {
      await candidaturasService.cancelar(id);
      setCandidaturas((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Candidatura cancelada" });
    } catch (err) {
      toast({
        title: "Erro ao cancelar",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    }
  }

  const iniciais = usuario?.nome
    ? usuario.nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  if (carregando) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground">Área do Universitário</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu perfil e candidaturas</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="perfil" className="flex items-center gap-2"><User className="w-4 h-4" /> Perfil</TabsTrigger>
          <TabsTrigger value="candidaturas" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Candidaturas</TabsTrigger>
          <TabsTrigger value="editar" className="flex items-center gap-2"><Edit className="w-4 h-4" /> Editar Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary font-display font-bold">{iniciais}</AvatarFallback>
                </Avatar>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="font-display font-bold text-xl">{perfil?.usuario?.nome || usuario?.nome}</h2>
                    <p className="text-sm text-muted-foreground">{perfil?.usuario?.email || usuario?.email}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Universidade:</span> <span className="font-medium">{perfil?.instituicao || "—"}</span></div>
                    <div><span className="text-muted-foreground">Curso:</span> <span className="font-medium">{perfil?.curso || "—"}</span></div>
                    <div><span className="text-muted-foreground">Localização:</span> <span className="font-medium">{perfil?.localizacao || "—"}</span></div>
                    <div><span className="text-muted-foreground">Matrícula:</span> <span className="font-medium">{perfil?.matricula || "—"}</span></div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Currículo / Documentos</p>
                    {perfil?.cvUrl ? (
                      <a href={perfil.cvUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" /> Ver currículo</Button>
                      </a>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Arraste seu currículo ou clique para enviar (PDF)</p>
                        <Button variant="outline" size="sm">Selecionar arquivo</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidaturas" className="mt-6 space-y-4">
          {candidaturas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Você ainda não se candidatou a nenhuma vaga.{" "}
                <Link to="/vagas" className="text-primary hover:underline">Ver vagas disponíveis</Link>
              </CardContent>
            </Card>
          ) : (
            candidaturas.map((c) => {
              const st = statusLabel[c.statusProcesso] || { label: c.statusProcesso, color: "bg-muted text-muted-foreground" };
              return (
                <Card key={c.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{c.vaga?.titulo}</p>
                        <p className="text-sm text-muted-foreground">{c.vaga?.empresa?.usuario?.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          Candidatura em: {new Date(c.dataCandidatura).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Badge className={st.color + " border-0"}>{st.label}</Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/vaga/${c.vaga?.id}`}><Eye className="w-4 h-4 mr-1" /> Ver Vaga</Link>
                      </Button>
                      {c.statusProcesso === "inscrito" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleCancelarCandidatura(c.id)}
                        >
                          <X className="w-4 h-4 mr-1" /> Cancelar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="editar" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="font-display">Editar Dados Cadastrais</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSalvar} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Nome Completo</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>E-mail</Label><Input value={email} readOnly className="opacity-60" /></div>
                  <div className="space-y-1.5"><Label>Universidade</Label><Input value={universidade} onChange={(e) => setUniversidade(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Curso</Label><Input value={curso} onChange={(e) => setCurso(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Semestre</Label><Input value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Ex: 8º" /></div>
                  <div className="space-y-1.5"><Label>Telefone</Label><Input value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="(11) 99999-0000" /></div>
                </div>
                <Separator />
                <div className="space-y-1.5"><Label>Nova Senha (opcional)</Label><Input type="password" placeholder="••••••••" /></div>
                <Button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar Alterações"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AreaUniversitario;
