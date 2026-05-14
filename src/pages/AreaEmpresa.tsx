import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, PlusCircle, Edit, LogOut, Users, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { perfilService, vagasService, Vaga, PerfilEmpresa } from "@/services/api";

const AreaEmpresa = () => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const [perfil, setPerfil] = useState<PerfilEmpresa | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Formulário nova vaga
  const [titulo, setTitulo] = useState("");
  const [cursoDesejado, setCursoDesejado] = useState("");
  const [area, setArea] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [duracao, setDuracao] = useState("");
  const [numVagas, setNumVagas] = useState("");
  const [descricao, setDescricao] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [dataExpiracao, setDataExpiracao] = useState("");
  const [etapas, setEtapas] = useState(["Análise curricular", "Entrevista com RH", "Entrevista técnica"]);

  // Formulário empresa
  const [eNome, setENome] = useState("");
  const [eCnpj, setECnpj] = useState("");
  const [eEmail, setEEmail] = useState("");
  const [eResponsavel, setEResponsavel] = useState("");
  const [eTelefone, setETelefone] = useState("");
  const [eArea, setEArea] = useState("");
  const [eEndereco, setEEndereco] = useState("");
  const [eDescricao, setEDescricao] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [resPerfil, resVagas] = await Promise.all([
          perfilService.meuPerfil(),
          vagasService.minhasVagas(),
        ]);
        const p = resPerfil.data as PerfilEmpresa;
        setPerfil(p);
        setVagas(resVagas.data);

        setENome(p.usuario?.nome || "");
        setEEmail(p.usuario?.email || "");
        setECnpj(p.cnpj || "");
        setETelefone(p.telefone || "");
        setEEndereco(p.localizacao || "");
        setEDescricao(p.descricao || "");
      } catch {
        toast({ title: "Erro ao carregar dados", variant: "destructive" });
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [toast]);

  async function handlePublicarVaga(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo || !area || !localizacao || !descricao || !dataExpiracao) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    setPublicando(true);
    try {
      const novaVaga = await vagasService.criar({
        titulo,
        area,
        cursoDesejado,
        localizacao,
        duracaoEstagio: duracao,
        descricao: `${descricao}\n\nRequisitos:\n${requisitos}`,
        dataExpiracao: new Date(dataExpiracao).toISOString(),
        etapas: etapas
          .filter((e) => e.trim())
          .map((nome, i) => ({ nomeEtapa: nome, numeroEtapa: i + 1, ordem: i + 1 })),
      });
      setVagas((prev) => [novaVaga.data, ...prev]);
      toast({ title: "Vaga publicada com sucesso!" });
      // Limpa formulário
      setTitulo(""); setArea(""); setLocalizacao(""); setDescricao(""); setRequisitos(""); setDataExpiracao("");
    } catch (err) {
      toast({
        title: "Erro ao publicar vaga",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setPublicando(false);
    }
  }

  async function handleExcluirVaga(id: string) {
    if (!confirm("Confirmar exclusão da vaga?")) return;
    try {
      await vagasService.deletar(id);
      setVagas((prev) => prev.filter((v) => v.id !== id));
      toast({ title: "Vaga excluída" });
    } catch (err) {
      toast({
        title: "Erro ao excluir",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    }
  }

  async function handleSalvarEmpresa(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await perfilService.atualizarEmpresa({
        cnpj: eCnpj,
        telefone: eTelefone,
        localizacao: eEndereco,
        descricao: eDescricao,
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
          <h1 className="font-display font-bold text-3xl text-foreground">Área da Empresa</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas vagas e candidatos</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> Sair</Button>
      </div>

      <Tabs defaultValue="vagas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vagas" className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Minhas Vagas</TabsTrigger>
          <TabsTrigger value="publicar" className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Publicar Vaga</TabsTrigger>
          <TabsTrigger value="editar" className="flex items-center gap-2"><Edit className="w-4 h-4" /> Dados da Empresa</TabsTrigger>
        </TabsList>

        <TabsContent value="vagas" className="mt-6 space-y-4">
          {vagas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Nenhuma vaga publicada ainda. Use a aba "Publicar Vaga" para criar.
              </CardContent>
            </Card>
          ) : (
            vagas.map((vaga) => (
              <Card key={vaga.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{vaga.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        Publicada em: {new Date(vaga.dataPublicacao).toLocaleDateString("pt-BR")}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-3 h-3" /> {vaga._count?.candidaturas ?? 0} candidatos inscritos
                      </div>
                    </div>
                    <Badge variant={vaga.status === "ativa" ? "default" : "secondary"}>
                      {vaga.status === "ativa" ? "Ativa" : "Encerrada"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button size="sm" asChild>
                      <Link to={`/gerenciar-candidatos/${vaga.id}`}><Users className="w-4 h-4 mr-1" /> Ver Candidatos</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleExcluirVaga(vaga.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="publicar" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="font-display">Publicar Nova Vaga</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handlePublicarVaga} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Título da Vaga *</Label>
                    <Input placeholder="Ex: Estágio em Engenharia Civil" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Curso Relacionado</Label>
                    <Input placeholder="Ex: Engenharia Civil" value={cursoDesejado} onChange={(e) => setCursoDesejado(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Área *</Label>
                    <Input placeholder="Ex: Construção, Gestão..." value={area} onChange={(e) => setArea(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Localização *</Label>
                    <Input placeholder="Cidade, UF" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Modalidade</Label>
                    <Select value={modalidade} onValueChange={setModalidade}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                        <SelectItem value="remoto">Remoto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Carga Horária</Label>
                    <Input placeholder="Ex: 30h semanais" value={duracao} onChange={(e) => setDuracao(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nº de Vagas</Label>
                    <Input type="number" placeholder="2" value={numVagas} onChange={(e) => setNumVagas(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Descrição da Vaga *</Label>
                  <Textarea
                    placeholder="Descreva as atividades, responsabilidades e rotina do estagiário..."
                    className="min-h-[100px]"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Requisitos</Label>
                  <Textarea
                    placeholder="Liste os requisitos para a vaga..."
                    className="min-h-[80px]"
                    value={requisitos}
                    onChange={(e) => setRequisitos(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Data de Encerramento *</Label>
                  <Input type="date" value={dataExpiracao} onChange={(e) => setDataExpiracao(e.target.value)} />
                </div>

                <Separator />
                <div className="space-y-3">
                  <Label className="text-base font-display">Etapas do Processo Seletivo</Label>
                  <p className="text-sm text-muted-foreground">Configure as etapas que os candidatos passarão</p>
                  {etapas.map((etapa, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</span>
                      <Input
                        value={etapa}
                        className="flex-1"
                        onChange={(e) => setEtapas((prev) => prev.map((v, idx) => idx === i ? e.target.value : v))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-destructive"
                        onClick={() => setEtapas((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setEtapas((prev) => [...prev, ""])}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Etapa
                  </Button>
                </div>
                <Separator />
                <Button className="w-full" size="lg" type="submit" disabled={publicando}>
                  {publicando ? "Publicando..." : "Publicar Vaga"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editar" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="font-display">Editar Dados da Empresa</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSalvarEmpresa} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Razão Social</Label><Input value={eNome} onChange={(e) => setENome(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>CNPJ</Label><Input value={eCnpj} onChange={(e) => setECnpj(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>E-mail</Label><Input value={eEmail} readOnly className="opacity-60" /></div>
                  <div className="space-y-1.5"><Label>Responsável RH</Label><Input value={eResponsavel} onChange={(e) => setEResponsavel(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Telefone</Label><Input value={eTelefone} onChange={(e) => setETelefone(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Área de Atuação</Label><Input value={eArea} onChange={(e) => setEArea(e.target.value)} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Endereço</Label><Input value={eEndereco} onChange={(e) => setEEndereco(e.target.value)} /></div>
                </div>
                <div className="space-y-1.5">
                  <Label>Descrição da Empresa</Label>
                  <Textarea value={eDescricao} onChange={(e) => setEDescricao(e.target.value)} className="min-h-[80px]" />
                </div>
                <Button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar Alterações"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AreaEmpresa;
