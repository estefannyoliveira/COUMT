import { Link } from "react-router-dom";
import { Search, GraduationCap, Building2, Briefcase, UserCheck, FileSearch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const vagasRecentes = [
    { id: 1, titulo: "Estágio em Engenharia Civil", empresa: "Construtora ABC", local: "São Paulo, SP", curso: "Engenharia Civil" },
    { id: 2, titulo: "Estágio em Administração", empresa: "Empresa XYZ Ltda", local: "Rio de Janeiro, RJ", curso: "Administração" },
    { id: 3, titulo: "Estágio em Psicologia", empresa: "Clínica Mente Sã", local: "Belo Horizonte, MG", curso: "Psicologia" },
    { id: 4, titulo: "Estágio em Direito", empresa: "Silva & Associados", local: "Curitiba, PR", curso: "Direito" },
  ];

  const cursos = ["Engenharia", "Administração", "Direito", "Psicologia", "Design", "Contabilidade"];

  return (
    <div className="space-y-0">
      {/* HERO */}
      <section className="gradient-hero py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 text-sm px-4 py-1">
            Conectando Universitários ao Mercado de Trabalho
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight">
            Encontre seu estágio<br />obrigatório ideal
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Conectamos universitários em fase final de graduação com empresas que oferecem vagas de estágio obrigatório não remunerado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por curso, área ou cidade..."
                className="pl-10 h-12 bg-primary-foreground border-0 text-foreground"
              />
            </div>
            <Button size="lg" variant="secondary" className="h-12 px-6 font-semibold" asChild>
              <Link to="/vagas">Buscar Vagas</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {cursos.map((curso) => (
              <Badge key={curso} variant="outline" className="border-primary-foreground/30 text-primary-foreground/90 hover:bg-primary-foreground/10 cursor-pointer transition-colors">
                {curso}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CARDS */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground">Para Universitários</h3>
              <p className="text-muted-foreground text-sm">Cadastre-se gratuitamente e encontre vagas de estágio obrigatório compatíveis com seu curso.</p>
              <Button asChild className="w-full">
                <Link to="/cadastro">Cadastrar como Universitário</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground">Para Empresas</h3>
              <p className="text-muted-foreground text-sm">Publique vagas e encontre estagiários qualificados para seu programa de estágio obrigatório.</p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/cadastro">Cadastrar como Empresa</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* VAGAS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground">Vagas Recentes</h2>
            <p className="text-sm text-muted-foreground mt-1">Oportunidades publicadas recentemente</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/vagas" className="flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vagasRecentes.map((vaga, i) => (
            <Link to={`/vaga/${vaga.id}`} key={vaga.id}>
              <Card className="hover:shadow-md hover:border-primary/30 transition-all group" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {vaga.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">{vaga.empresa}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">{vaga.curso}</Badge>
                      <Badge variant="outline" className="text-xs">{vaga.local}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="gradient-hero-soft py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center">
            <h2 className="font-display font-bold text-2xl text-foreground">Como Funciona</h2>
            <p className="text-sm text-muted-foreground mt-2">Seu caminho para o estágio em 3 passos simples</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: UserCheck, title: "Cadastre-se", desc: "Crie sua conta gratuitamente como universitário ou empresa." },
              { icon: FileSearch, title: "Busque vagas", desc: "Filtre vagas por curso, área e localização." },
              { icon: Briefcase, title: "Candidate-se", desc: "Aplique para as vagas e acompanhe o processo seletivo." },
            ].map((step, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">{i + 1}</span>
                  <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
