import { useState } from "react";
import { GraduationCap, Building2, Mail, Lock, User, BookOpen, School, Hash, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { login, registrar } = useAuth();
  const { toast } = useToast();

  const [tipoUsuario, setTipoUsuario] = useState<"universitario" | "empresa">("universitario");
  const [carregando, setCarregando] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  // Cadastro universitário
  const [uNome, setUNome] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uUniversidade, setUUniversidade] = useState("");
  const [uCurso, setUCurso] = useState("");
  const [uSemestre, setUSemestre] = useState("");
  const [uSenha, setUSenha] = useState("");

  // Cadastro empresa
  const [eNome, setENome] = useState("");
  const [eCnpj, setECnpj] = useState("");
  const [eEmail, setEEmail] = useState("");
  const [eResponsavel, setEResponsavel] = useState("");
  const [eSenha, setESenha] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail || !loginSenha) {
      toast({ title: "Preencha e-mail e senha", variant: "destructive" });
      return;
    }
    setCarregando(true);
    try {
      await login(loginEmail, loginSenha);
    } catch (err) {
      toast({
        title: "Erro ao entrar",
        description: err instanceof Error ? err.message : "Verifique suas credenciais",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      if (tipoUsuario === "universitario") {
        await registrar({
          tipo: "universitario",
          nome: uNome,
          email: uEmail,
          senha: uSenha,
          curso: uCurso,
          instituicao: uUniversidade,
          semestre: uSemestre,
        });
      } else {
        await registrar({
          tipo: "empresa",
          nome: eNome,
          email: eEmail,
          senha: eSenha,
          cnpj: eCnpj,
          responsavel: eResponsavel,
        });
      }
    } catch (err) {
      toast({
        title: "Erro no cadastro",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-2xl">Bem-vindo ao COUMT</CardTitle>
          <CardDescription>Acesse sua conta ou crie uma nova</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="senha"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="rounded border-input" />
                    Lembrar-me
                  </label>
                  <a href="#" className="text-primary hover:underline text-sm">Esqueci a senha</a>
                </div>
                <Button className="w-full" size="lg" type="submit" disabled={carregando}>
                  {carregando ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="cadastro">
              <form onSubmit={handleCadastro} className="space-y-4">
                {/* Tipo toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("universitario")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      tipoUsuario === "universitario"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" /> Universitário
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("empresa")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      tipoUsuario === "empresa"
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border text-muted-foreground hover:border-accent/30"
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Empresa
                  </button>
                </div>

                {tipoUsuario === "universitario" ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="João da Silva" className="pl-10" value={uNome} onChange={(e) => setUNome(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>E-mail Institucional</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="aluno@universidade.edu.br" className="pl-10" value={uEmail} onChange={(e) => setUEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Universidade</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Nome da universidade" className="pl-10" value={uUniversidade} onChange={(e) => setUUniversidade(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Curso</Label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Engenharia" className="pl-10" value={uCurso} onChange={(e) => setUCurso(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Semestre</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="8º" className="pl-10" value={uSemestre} onChange={(e) => setUSemestre(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" className="pl-10" value={uSenha} onChange={(e) => setUSenha(e.target.value)} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Razão Social</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Nome da empresa" className="pl-10" value={eNome} onChange={(e) => setENome(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>CNPJ</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="00.000.000/0000-00" className="pl-10" value={eCnpj} onChange={(e) => setECnpj(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>E-mail Corporativo</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="contato@empresa.com.br" className="pl-10" value={eEmail} onChange={(e) => setEEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Responsável</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Nome do responsável RH" className="pl-10" value={eResponsavel} onChange={(e) => setEResponsavel(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" className="pl-10" value={eSenha} onChange={(e) => setESenha(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}
                <Button className="w-full" size="lg" type="submit" disabled={carregando}>
                  {carregando ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
