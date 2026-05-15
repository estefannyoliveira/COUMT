import { Link } from "react-router-dom";
import { Search, GraduationCap, Building2, Briefcase, UserCheck, FileSearch, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import studentImg from "@/assets/student-3d.png";

const HeroIllustration = () => (
  <div className="relative flex items-center justify-center w-full min-h-[420px] md:min-h-[500px]">
    {/* Círculo plataforma */}
    <div className="absolute w-[380px] h-[380px] md:w-[440px] md:h-[440px] lg:w-[520px] lg:h-[520px] rounded-full bg-primary/8" />
    {/* Anel externo */}
    <div className="absolute w-[440px] h-[440px] md:w-[510px] md:h-[510px] lg:w-[600px] lg:h-[600px] rounded-full border border-primary/10" />
    {/* Anel pontilhado */}
    <div className="hero-ring-dashed absolute w-[340px] h-[340px] md:w-[395px] md:h-[395px] lg:w-[465px] lg:h-[465px] rounded-full" />

    {/* Dots flutuantes */}
    <div className="absolute top-8 right-[14%] w-5 h-5 rounded-full bg-primary/25" />
    <div className="absolute top-[22%] right-[4%] w-3 h-3 rounded-full bg-accent/30" />
    <div className="absolute bottom-[18%] right-[7%] w-4 h-4 rounded-full bg-primary/20" />
    <div className="absolute bottom-8 left-[17%] w-3.5 h-3.5 rounded-full bg-accent/25" />
    <div className="absolute top-[45%] left-[3%] w-2.5 h-2.5 rounded-full bg-primary/30" />

    {/* Imagem — ocupa toda a coluna */}
    <img
      src={studentImg}
      alt="Estudante universitário com capelo de formatura"
      className="relative z-10 w-full max-w-[360px] md:max-w-[460px] lg:max-w-[540px] h-auto drop-shadow-2xl"
    />
  </div>
);

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
      {/* ── HERO ── */}
      <section className="hero-bg relative overflow-hidden border-b border-border/40">
        {/* Shapes decorativas — Opção C */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Círculo grande — canto superior direito */}
          <circle cx="85%" cy="-5%" r="280" fill="hsl(var(--primary) / 0.06)" />
          {/* Círculo médio — centro direita */}
          <circle cx="92%" cy="60%" r="160" fill="hsl(var(--accent) / 0.07)" />
          {/* Círculo pequeno — canto inferior esquerdo */}
          <circle cx="8%" cy="110%" r="140" fill="hsl(var(--primary) / 0.05)" />
          {/* Anéis decorativos */}
          <circle cx="80%" cy="15%" r="90" stroke="hsl(var(--primary) / 0.1)" strokeWidth="1.5" fill="none" />
          <circle cx="12%" cy="75%" r="55" stroke="hsl(var(--accent) / 0.12)" strokeWidth="1" fill="none" />
          {/* Dot cluster — canto superior esquerdo */}
          <circle cx="5%" cy="20%" r="3" fill="hsl(var(--primary) / 0.2)" />
          <circle cx="8%" cy="15%" r="2" fill="hsl(var(--primary) / 0.15)" />
          <circle cx="3%" cy="30%" r="2.5" fill="hsl(var(--accent) / 0.2)" />
        </svg>

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* LEFT: text content */}
            <div className="space-y-6 order-2 md:order-1">
              <Badge className="bg-primary/10 text-primary border-0 text-sm px-4 py-1.5 font-medium">
                🎓 Plataforma de Estágio Obrigatório
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.15]">
                Encontre seu<br />
                <span className="text-primary">estágio obrigatório</span><br />
                ideal
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Conectamos universitários em fase final de graduação com empresas
                que oferecem vagas de estágio obrigatório não remunerado.
              </p>

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por curso, área ou cidade..."
                    className="pl-10 h-12 bg-card border-border shadow-sm"
                  />
                </div>
                <Button size="lg" className="h-12 px-6 font-semibold shrink-0" asChild>
                  <Link to="/vagas">Buscar Vagas</Link>
                </Button>
              </div>

              {/* Quick-filter pills */}
              <div className="flex flex-wrap gap-2">
                {cursos.map((curso) => (
                  <Badge
                    key={curso}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {curso}
                  </Badge>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                {[
                  { value: "500+", label: "Vagas ativas" },
                  { value: "200+", label: "Empresas parceiras" },
                  { value: "1.000+", label: "Universitários cadastrados" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      <strong className="text-foreground font-semibold">{stat.value}</strong>{" "}
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: illustration */}
            <div className="order-1 md:order-2 flex items-center justify-center">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA CARDS ── */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Universitário */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-border/60 group">
            <CardContent className="p-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-foreground">Para Universitários</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Cadastre-se gratuitamente e encontre vagas de estágio obrigatório
                  compatíveis com seu curso e localização.
                </p>
              </div>
              <div className="space-y-3">
                <Button asChild className="w-full font-semibold">
                  <Link to="/cadastro">Cadastrar como Universitário</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5">
                  <Link to="/vagas" className="flex items-center justify-center gap-1.5">
                    Explorar vagas <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Empresa */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-border/60 group">
            <CardContent className="p-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                <Building2 className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-foreground">Para Empresas</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Publique vagas e encontre estagiários qualificados para seu
                  programa de estágio obrigatório sem custo de remuneração.
                </p>
              </div>
              <div className="space-y-3">
                <Button variant="outline" asChild className="w-full font-semibold border-accent/30 hover:bg-accent/5 hover:border-accent/50">
                  <Link to="/cadastro">Cadastrar como Empresa</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full text-accent hover:text-accent hover:bg-accent/5">
                  <Link to="/login" className="flex items-center justify-center gap-1.5">
                    Já tenho conta <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── VAGAS RECENTES ── */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-3xl text-foreground">Vagas Recentes</h2>
            <p className="text-muted-foreground">Oportunidades publicadas recentemente na plataforma</p>
          </div>
          <Button variant="ghost" asChild className="text-primary hover:text-primary hover:bg-primary/5 shrink-0">
            <Link to="/vagas" className="flex items-center gap-1.5">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vagasRecentes.map((vaga, i) => (
            <Link to={`/vaga/${vaga.id}`} key={vaga.id}>
              <Card
                className="hover:shadow-md hover:border-primary/25 transition-all duration-200 group border border-border/60"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate leading-snug">
                      {vaga.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">{vaga.empresa}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">{vaga.curso}</Badge>
                      <Badge variant="outline" className="text-xs">{vaga.local}</Badge>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="gradient-hero-soft border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 py-20 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-display font-bold text-3xl text-foreground">Como Funciona</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Seu caminho para o estágio obrigatório em 3 passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: UserCheck,
                title: "Cadastre-se",
                desc: "Crie sua conta gratuitamente como universitário ou empresa em menos de 2 minutos.",
              },
              {
                icon: FileSearch,
                title: "Busque vagas",
                desc: "Filtre oportunidades por curso, área de atuação e localização.",
              },
              {
                icon: Briefcase,
                title: "Candidate-se",
                desc: "Aplique para as vagas com um clique e acompanhe o processo seletivo.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/15 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-primary-foreground bg-primary rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <h3 className="font-display font-semibold text-foreground text-lg">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed px-4">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="font-semibold px-8">
              <Link to="/cadastro">Começar agora — é grátis</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
