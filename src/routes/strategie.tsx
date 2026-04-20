import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { Footprints, Megaphone, Rocket } from "lucide-react";

export const Route = createFileRoute("/strategie")({
  component: Strategie,
  head: () => ({
    meta: [
      { title: "Stratégie marketing — GoLivra" },
      { name: "description", content: "Terrain, pré-lancement et lancement local : la stratégie progressive de GoLivra avant le grand jour." },
    ],
  }),
});

const phases = [
  {
    icon: Footprints,
    tag: "Phase 1",
    title: "Terrain — obligatoire",
    text: "Aller voir restaurants et vendeurs, en personne, et leur expliquer simplement : « vous vendez comme avant, nous gérons la livraison et les clients ».",
    points: ["Visites directes", "Discours simple et concret", "Engagement humain avant tout"],
  },
  {
    icon: Megaphone,
    tag: "Phase 2",
    title: "Pré-lancement",
    text: "Construire une présence digitale et créer l'attente. Pages Facebook et TikTok, vidéos de démonstration, liste d'attente pour les premiers utilisateurs.",
    points: ["Page Facebook & TikTok", "Vidéos de démo", "Liste d'attente"],
  },
  {
    icon: Rocket,
    tag: "Phase 3",
    title: "Lancement Brazzaville",
    text: "Démarrer sur Brazzaville avec des offres gratuites au départ pour créer l'habitude. Focus total sur la vitesse et la fiabilité, puis expansion vers d'autres villes.",
    points: ["Tout Brazzaville", "Offres gratuites au début", "Vitesse + fiabilité"],
  },
];

function Strategie() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Stratégie marketing"
        title="Lent. Local. Imparable."
        intro="Avant le grand lancement, GoLivra construit la confiance sur le terrain, prépare le digital et démarre dans tout Brazzaville — sans autorisation spéciale ni gros capital."
      />
      <section className="py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          {phases.map((p, i) => (
            <article key={p.tag} className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-8 p-7 sm:p-10 md:p-12 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] hover-lift animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="flex flex-col gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[image:var(--gradient-hero)] text-primary-foreground flex items-center justify-center shadow-[var(--shadow-soft)]">
                  <p.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{p.tag}</span>
                  <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">{p.title}</h2>
                </div>
                <span className="hidden md:block text-7xl font-black text-primary/10 leading-none">0{i + 1}</span>
              </div>
              <div>
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">{p.text}</p>
                <ul className="mt-5 sm:mt-6 grid sm:grid-cols-3 gap-3">
                  {p.points.map((x) => (
                    <li key={x} className="px-4 py-3 rounded-xl bg-muted text-sm font-semibold text-foreground/80">{x}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
