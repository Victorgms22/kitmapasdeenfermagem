import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen, Brain, CheckCircle2, ClipboardList, Eye, FileDown, GraduationCap,
  HeartPulse, Instagram, Layers, RefreshCw, ShieldCheck, Sparkles, Stethoscope, Target, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import hero from "@/assets/hero-mockup.jpg";
import { PRICE_FROM, PRICE_NOW, discountPercent, formatBRL } from "@/lib/pricing";

const TITLE = "+350 Mapas Mentais para Enfermagem e Saúde";
const DESC = "Coleção digital com mais de 350 mapas mentais para estudar enfermagem e saúde de forma visual, prática e organizada.";
const CHECKOUT_URL = "https://pay.cakto.com.br/r2wd3k5_1235643";
const INSTAGRAM = "kitenfermagemoficial";
const PROMO_SECONDS = 15 * 60;
const PROMO_KEY = "promo-ends-at";
const TRACKING_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "sck", "fbclid", "src",
] as const;
const TRACKING_STORAGE_KEY = "checkout-tracking-params";

function readSavedTrackingParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(TRACKING_STORAGE_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

// Só chamar de dentro de um useEffect: lê window.location.search e sessionStorage.
function saveTrackingParams() {
  if (typeof window === "undefined") return;
  const saved = readSavedTrackingParams();
  const url = new URLSearchParams(window.location.search);
  for (const key of TRACKING_KEYS) {
    const value = url.get(key);
    if (value) saved[key] = value;
  }
  sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(saved));
}

// Só chamar depois que a página montar: preserva query params já existentes no
// CHECKOUT_URL e não duplica nenhum parâmetro salvo.
function buildCheckoutUrl() {
  if (typeof window === "undefined") return CHECKOUT_URL;
  const saved = readSavedTrackingParams();
  const keys = Object.keys(saved);
  if (keys.length === 0) return CHECKOUT_URL;
  const url = new URL(CHECKOUT_URL);
  for (const key of keys) {
    const value = saved[key];
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return url.toString();
}

function useCheckoutUrl() {
  const [href, setHref] = useState(CHECKOUT_URL);
  useEffect(() => {
    saveTrackingParams();
    setHref(buildCheckoutUrl());
  }, []);
  return href;
}

function usePromoLeft() {
  const [left, setLeft] = useState(PROMO_SECONDS);
  useEffect(() => {
    let end = Number(localStorage.getItem(PROMO_KEY));
    if (!end || end < Date.now()) {
      end = Date.now() + PROMO_SECONDS * 1000;
      localStorage.setItem(PROMO_KEY, String(end));
    }
    const tick = () => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

function formatMMSS(left: number) {
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function BlackFridayBar() {
  const left = usePromoLeft();
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-12 flex-col items-center justify-center overflow-hidden border-b border-[#F6C453]/30 bg-[#0A0A0A] leading-tight">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(246,196,83,0.22),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-y-0 w-1/3 animate-[bf-shine_3s_linear_infinite] bg-gradient-to-r from-transparent via-[#F6C453]/30 to-transparent" />
      <p className="relative flex items-center gap-2 text-sm font-extrabold tracking-[0.25em] text-[#F6C453] drop-shadow-[0_0_10px_rgba(246,196,83,0.7)]">
        <Sparkles className="h-3.5 w-3.5" /> BLACK FRIDAY <Sparkles className="h-3.5 w-3.5" />
      </p>
      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">
        só esse mês · termina em <span className="font-mono tabular-nums text-[#F6C453]">{formatMMSS(left)}</span>
      </p>
    </div>
  );
}

function Countdown() {
  const left = usePromoLeft();
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-deep">A oferta termina em:</p>
      <p className="mt-2 inline-block rounded-xl bg-deep px-5 py-2 font-mono text-3xl font-extrabold tabular-nums text-deep-foreground">{mm}:{ss}</p>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${TITLE} | R$ 27,99` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const receber = [
  { icon: Layers, t: "+350 mapas mentais", d: "Uma coleção ampla de materiais visuais para consulta e revisão." },
  { icon: Stethoscope, t: "Conteúdos de enfermagem", d: "Mapas mentais relacionados aos assuntos de enfermagem presentes na coleção." },
  { icon: HeartPulse, t: "Conteúdos da área da saúde", d: "Materiais de apoio para estudar temas contemplados no pacote." },
  { icon: RefreshCw, t: "Revisão visual", d: "Organize informações e retome conceitos de maneira visual." },
  { icon: FileDown, t: "Material digital", d: "Acesse os arquivos conforme o formato e as instruções de entrega." },
  { icon: Target, t: "Apoio à preparação para provas", d: "Utilize os mapas mentais como complemento à sua preparação." },
];
const vantagens = [
  { icon: Eye, t: "Aprendizado visual", d: "Visualize conceitos de maneira estruturada." },
  { icon: RefreshCw, t: "Revisão prática", d: "Retome conteúdos de forma organizada." },
  { icon: ClipboardList, t: "Organização dos estudos", d: "Consulte os materiais de acordo com suas necessidades." },
  { icon: Sparkles, t: "Mais praticidade", d: "Tenha diversos materiais de apoio reunidos em uma coleção." },
];
const publico = [
  { icon: GraduationCap, t: "Estudantes de enfermagem", d: "Para complementar os estudos durante a formação." },
  { icon: Users, t: "Profissionais de enfermagem", d: "Para consultar materiais de apoio e revisar conteúdos." },
  { icon: BookOpen, t: "Estudantes da área da saúde", d: "Para quem busca recursos visuais para apoiar a aprendizagem." },
];
const faq = [
  ["O que vou receber na compra?", "Uma coleção digital com mais de 350 mapas mentais para enfermagem e saúde, conforme os materiais descritos na oferta."],
  ["Como receberei os mapas mentais?", "O acesso e as instruções de entrega serão informados conforme o método configurado para a compra."],
  ["O material é físico ou digital?", "A coleção é digital."],
  ["Para quem a coleção é indicada?", "Para estudantes e profissionais que desejam utilizar mapas mentais como apoio aos estudos na área da enfermagem e saúde."],
  ["Os mapas mentais substituem aulas e livros?", "Não. Eles são materiais complementares e devem ser utilizados junto a outras fontes confiáveis de estudo."],
  ["Como posso pagar?", "As formas de pagamento disponíveis serão apresentadas na página de checkout."],
] as const;

function Cta({ children, href = "#oferta" }: { children: string; href?: string }) {
  return (
    <Button asChild variant="cta">
      <a href={href}>{children}</a>
    </Button>
  );
}

function Heading({ title, sub, light }: { title: string; sub?: string; light?: boolean }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${light ? "text-deep-foreground" : "text-deep"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${light ? "text-deep-foreground/80" : "text-muted-foreground"}`}>{sub}</p>}
    </div>
  );
}

function Card({ icon: Icon, t, d }: { icon: typeof Brain; t: string; d: string }) {
  return (
    <div className="rounded-2xl bg-card p-7 shadow-soft transition-transform hover:-translate-y-1">
      <div className="mb-4 inline-flex rounded-xl bg-muted p-3 text-primary"><Icon className="h-6 w-6" /></div>
      <h3 className="text-lg font-bold text-deep">{t}</h3>
      <p className="mt-2 text-muted-foreground">{d}</p>
    </div>
  );
}

function Index() {
  const checkoutUrl = useCheckoutUrl();
  return (
    <main className="font-sans">
      {/* Barra Black Friday */}
      <BlackFridayBar />
      <div className="h-12" aria-hidden="true" />

      {/* Hero */}
      <section className="bg-deep-gradient text-deep-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-extrabold tracking-widest text-primary">
              <Brain className="h-4 w-4" /> +350 MAPAS MENTAIS
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              <span className="text-primary">+350</span> Mapas Mentais para Enfermagem e Saúde
            </h1>
            <p className="mt-5 text-xl font-semibold">Estude de forma mais visual, prática e organizada.</p>
            <p className="mt-3 text-deep-foreground/80">
              Uma coleção digital de mapas mentais para complementar sua rotina de estudos e facilitar a revisão dos principais conteúdos da área da saúde.
            </p>
            <div className="mt-8"><Cta>QUERO ACESSAR OS MAPAS MENTAIS</Cta></div>
          </div>
          <img src={hero} alt="Coleção digital de mapas mentais de enfermagem em tablet, notebook e folhas" width={1280} height={960} className="w-full rounded-3xl shadow-glow" />
        </div>
      </section>

      <section className="bg-background px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Heading title="O que você vai receber?" sub="Uma coleção de mapas mentais para apoiar seus estudos." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{receber.map((i) => <Card key={i.t} {...i} />)}</div>
          <div className="mt-12 text-center"><Cta>QUERO MEU ACESSO</Cta></div>
        </div>
      </section>

      <section className="bg-muted px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Heading title="Por que estudar com mapas mentais?" sub="Os mapas mentais ajudam a representar informações visualmente e podem complementar diferentes métodos de estudo." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{vantagens.map((i) => <Card key={i.t} {...i} />)}</div>
        </div>
      </section>

      <section className="bg-background px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Heading title="Para quem é essa coleção?" />
          <div className="grid gap-6 md:grid-cols-3">{publico.map((i) => <Card key={i.t} {...i} />)}</div>
        </div>
      </section>

      {/* Oferta */}
      <section id="oferta" className="bg-deep-gradient px-5 py-20 text-deep-foreground">
        <div className="mx-auto max-w-xl text-center">
          <Heading light title="Tenha acesso a +350 Mapas Mentais" sub="Uma coleção digital para complementar sua jornada na enfermagem e na saúde." />
          <div className="rounded-3xl bg-card p-8 text-card-foreground shadow-glow sm:p-10">
            <p className="font-bold text-deep">{TITLE}</p>
            <ul className="mt-6 space-y-3 text-left">
              {["Coleção com mais de 350 mapas mentais", "Materiais digitais de enfermagem e saúde"].map((x) => (
                <li key={x} className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />{x}</li>
              ))}
            </ul>
            <Countdown />
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-lg text-muted-foreground line-through">De {formatBRL(PRICE_FROM)}</span>
              <span className="rounded-full bg-destructive px-3 py-1 text-sm font-extrabold text-destructive-foreground">{discountPercent(PRICE_FROM, PRICE_NOW)}% OFF</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Por apenas</p>
            <p className="text-5xl font-extrabold text-primary">{formatBRL(PRICE_NOW)}</p>
            <div className="mt-8"><Cta href={checkoutUrl}>QUERO MEUS +350 MAPAS MENTAIS</Cta></div>
          </div>
        </div>
      </section>

      <section className="bg-background px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center shadow-soft sm:flex-row sm:text-left">
            <ShieldCheck className="h-12 w-12 shrink-0 text-primary" />
            <div>
              <h3 className="text-xl font-bold text-deep">Compre com tranquilidade</h3>
              <p className="mt-1 text-muted-foreground">Confira as condições de compra, o método de entrega e as regras de reembolso.</p>
            </div>
          </div>
          <Heading title="Dúvidas frequentes" />
          <Accordion type="single" collapsible className="space-y-3">
            {faq.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="rounded-2xl border-none bg-card px-6 shadow-soft">
                <AccordionTrigger className="text-left font-semibold text-deep">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-deep-gradient px-5 py-20 text-center text-deep-foreground">
        <Heading light title="Transforme a maneira como você revisa os conteúdos" sub="Tenha mais de 350 mapas mentais para complementar seus estudos de enfermagem e saúde." />
        <Cta href={checkoutUrl}>QUERO ACESSAR A COLEÇÃO</Cta>
      </section>

      <footer className="border-t border-deep-foreground/10 bg-deep px-5 py-10 text-sm text-deep-foreground/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <p className="font-bold text-deep-foreground">{TITLE}</p>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["Contato e suporte", "Política de privacidade", "Termos de uso", "Política de compra e reembolso"].map((l) => (
              <a key={l} href="#" className="hover:text-primary">{l}</a>
            ))}
          </nav>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
            <Instagram className="h-5 w-5" /> @{INSTAGRAM}
          </a>
          <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
