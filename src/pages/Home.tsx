import { Link } from "react-router-dom";
import { Search, GraduationCap, Building2, Briefcase, UserCheck, FileSearch, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Flat-design SVG illustration of a university student — uses only the existing color palette
const HeroIllustration = () => (
  <div className="relative flex items-center justify-center w-full">
    <svg
      viewBox="0 0 420 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs md:max-w-sm lg:max-w-md h-auto"
      aria-hidden="true"
    >
      {/* Ground shadow */}
      <ellipse cx="210" cy="440" rx="140" ry="14" fill="hsl(210 72% 35% / 0.08)" />

      {/* Large background circle */}
      <circle cx="210" cy="220" r="175" fill="hsl(210 72% 35% / 0.06)" />
      <circle cx="210" cy="220" r="145" fill="hsl(210 72% 35% / 0.07)" />

      {/* Torso / shirt */}
      <rect x="148" y="268" width="124" height="148" rx="24" fill="hsl(210 72% 35%)" />

      {/* Shirt collar V */}
      <path d="M182 268 L210 302 L238 268" fill="hsl(200 25% 38%)" />

      {/* Neck */}
      <rect x="197" y="248" width="26" height="24" rx="8" fill="hsl(30 25% 82%)" />

      {/* Head */}
      <circle cx="210" cy="215" r="58" fill="hsl(30 25% 82%)" />

      {/* Hair */}
      <path
        d="M155 208 Q158 162 210 156 Q262 152 266 208 Q258 170 210 168 Q162 168 155 208Z"
        fill="hsl(20 30% 22%)"
      />

      {/* Left eye */}
      <circle cx="192" cy="212" r="5.5" fill="hsl(200 30% 15%)" />
      <circle cx="194" cy="210" r="2" fill="white" opacity="0.6" />

      {/* Right eye */}
      <circle cx="228" cy="212" r="5.5" fill="hsl(200 30% 15%)" />
      <circle cx="230" cy="210" r="2" fill="white" opacity="0.6" />

      {/* Smile */}
      <path
        d="M193 230 Q210 244 227 230"
        stroke="hsl(200 30% 15%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mortarboard — brim */}
      <rect x="166" y="168" width="88" height="14" rx="5" fill="hsl(210 72% 26%)" />
      {/* Mortarboard — top */}
      <rect x="182" y="146" width="56" height="24" rx="5" fill="hsl(210 72% 26%)" />
      {/* Tassel string */}
      <line x1="238" y1="158" x2="260" y2="180" stroke="hsl(38 92% 50%)" strokeWidth="3" strokeLinecap="round" />
      {/* Tassel end */}
      <circle cx="260" cy="185" r="6" fill="hsl(38 92% 50%)" />

      {/* Left arm */}
      <rect x="102" y="272" width="46" height="112" rx="23" fill="hsl(210 72% 35%)" />
      {/* Left hand */}
      <circle cx="125" cy="388" r="16" fill="hsl(30 25% 82%)" />

      {/* Right arm */}
      <rect x="272" y="272" width="46" height="112" rx="23" fill="hsl(210 72% 35%)" />
      {/* Right hand */}
      <circle cx="295" cy="388" r="16" fill="hsl(30 25% 82%)" />

      {/* Book in left hand */}
      <rect x="90" y="356" width="62" height="48" rx="6" fill="hsl(200 25% 38%)" />
      <rect x="96" y="362" width="50" height="36" rx="3" fill="white" opacity="0.18" />
      <line x1="121" y1="362" x2="121" y2="398" stroke="hsl(200 25% 38%)" strokeWidth="2.5" />
      <rect x="100" y="368" width="18" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="100" y="375" width="14" height="3" rx="1.5" fill="white" opacity="0.5" />
      <rect x="100" y="382" width="16" height="3" rx="1.5" fill="white" opacity="0.5" />

      {/* Diploma / scroll in right hand */}
      <rect x="268" y="356" width="58" height="44" rx="10" fill="hsl(40 25% 92%)" />
      <rect x="275" y="364" width="44" height="4" rx="2" fill="hsl(210 72% 35%)" opacity="0.45" />
      <rect x="275" y="373" width="36" height="4" rx="2" fill="hsl(210 72% 35%)" opacity="0.45" />
      <rect x="275" y="382" width="40" height="4" rx="2" fill="hsl(210 72% 35%)" opacity="0.45" />
      {/* Diploma ribbon */}
      <rect x="290" y="394" width="16" height="6" rx="3" fill="hsl(38 92% 50%)" />

      {/* Floating stat card: vagas */}
      <rect x="14" y="120" width="120" height="44" rx="12" fill="white" />
      <rect x="14" y="120" width="120" height="44" rx="12" stroke="hsl(210 72% 35% / 0.15)" strokeWidth="1.5" />
      <circle cx="36" cy="142" r="10" fill="hsl(210 72% 35% / 0.12)" />
      <circle cx="36" cy="142" r="4" fill="hsl(210 72% 35%)" />
      <rect x="52" y="134" width="68" height="7" rx="3.5" fill="hsl(200 30% 15%)" opacity="0.75" />
      <rect x="52" y="146" width="50" height="6" rx="3" fill="hsl(200 10% 45%)" opacity="0.5" />

      {/* Floating stat card: empresas */}
      <rect x="286" y="80" width="120" height="44" rx="12" fill="white" />
      <rect x="286" y="80" width="120" height="44" rx="12" stroke="hsl(200 25% 38% / 0.15)" strokeWidth="1.5" />
      <circle cx="308" cy="102" r="10" fill="hsl(200 25% 38% / 0.12)" />
      <circle cx="308" cy="102" r="4" fill="hsl(200 25% 38%)" />
      <rect x="324" y="94" width="68" height="7" rx="3.5" fill="hsl(200 30% 15%)" opacity="0.75" />
      <rect x="324" y="106" width="50" height="6" rx="3" fill="hsl(200 10% 45%)" opacity="0.5" />

      {/* Floating check badge */}
      <rect x="300" y="300" width="100" height="38" rx="10" fill="white" />
      <rect x="300" y="300" width="100" height="38" rx="10" stroke="hsl(142 71% 45% / 0.2)" strokeWidth="1.5" />
      <circle cx="320" cy="319" r="9" fill="hsl(142 71% 45% / 0.15)" />
      <path d="M315 319 L318 323 L325 314" stroke="hsl(142 71% 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="334" y="312" width="54" height="6" rx="3" fill="hsl(200 30% 15%)" opacity="0.7" />
      <rect x="334" y="322" width="40" height="5" rx="2.5" fill="hsl(200 10% 45%)" opacity="0.5" />

      {/* Decorative dots */}
      <circle cx="72" cy="72" r="10" fill="hsl(210 72% 35% / 0.12)" />
      <circle cx="355" cy="240" r="14" fill="hsl(200 25% 38% / 0.1)" />
      <circle cx="48" cy="330" r="8" fill="hsl(210 72% 35% / 0.12)" />
      <circle cx="370" cy="380" r="10" fill="hsl(38 92% 50% / 0.2)" />

      {/* Star decorations */}
      <path d="M350 50 L352.4 57.3 L360 57.3 L353.8 61.9 L356.2 69.3 L350 64.7 L343.8 69.3 L346.2 61.9 L340 57.3 L347.6 57.3Z" fill="hsl(38 92% 50%)" opacity="0.6" />
      <path d="M65 180 L66.4 184.2 L70.8 184.2 L67.2 186.8 L68.6 191 L65 188.4 L61.4 191 L62.8 186.8 L59.2 184.2 L63.6 184.2Z" fill="hsl(210 72% 35%)" opacity="0.4" />
    </svg>
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
      <section className="bg-background relative overflow-hidden border-b border-border/40">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--primary) / 0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Blue accent blob — top right */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

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
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
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
