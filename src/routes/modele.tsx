import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { Coins, Percent, BadgeCheck, BarChart3, Handshake, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/modele")({
  component: Modele,
  head: () => ({
    meta: [
      { title: "Modèle économique — GoLivra" },
      { name: "description", content: "Commission négociée par société de livraison, marketplace et abonnement vendeur : le modèle économique flexible de GoLivra." },
    ],
  }),
});

const streams = [
  {
    icon: Coins,
    t: "Commission sur livraison",
    v: "Négociée",
    d: "Chaque société de livraison signe son propre accord avec GoLivra selon sa réalité terrain.",
    primary: true,
  },
  {
    icon: Percent,
    t: "Commission marketplace",
    v: "Variable",
    d: "GoLivra peut percevoir une commission sur les ventes réalisées via la plateforme.",
    primary: false,
  },
  {
    icon: BadgeCheck,
    t: "Services premium",
    v: "Optionnel",
    d: "Des options de visibilité ou d'accompagnement peuvent etre proposees aux vendeurs.",
    primary: false,
  },
];

const deals = [
  {
    n: "A",
    t: "Partenaire local",
    v: "Accord standard",
    d: "Un cadre simple pour demarrer vite avec un partenaire livraison.",
  },
  {
    n: "B",
    t: "Partenaire volume",
    v: "Accord evolutif",
    d: "Le modele peut evoluer avec le volume et la couverture geographique.",
  },
  {
    n: "C",
    t: "Partenaire hybride",
    v: "Accord sur mesure",
    d: "Un format adapte lorsque le partenaire a une organisation particuliere.",
  },
];

function Modele() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Modèle économique"
        title="Un modèle simple, flexible, scalable."
        intro="GoLivra repose principalement sur une commission négociée avec chaque société de livraison, complétée par des revenus optionnels qui grandissent avec la plateforme."
      />

      {/* STREAMS */}
      <section className="py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {streams.map((s, i) => (
            <div key={s.t} className={`rounded-3xl p-7 sm:p-8 border shadow-[var(--shadow-card)] hover-lift animate-fade-up ${s.primary ? "bg-[image:var(--gradient-hero)] text-primary-foreground border-transparent shadow-[var(--shadow-elegant)] sm:col-span-2 lg:col-span-1" : "bg-card border-border"}`} style={{ animationDelay: `${i * 100}ms` }}>
              <s.icon className={`h-8 w-8 ${s.primary ? "text-primary-foreground" : "text-primary"}`} />
              <h3 className="mt-5 text-xl font-bold">{s.t}</h3>
              <p className={`mt-3 text-xl sm:text-2xl md:text-3xl font-black ${s.primary ? "" : "text-primary"}`}>{s.v}</p>
              <p className={`mt-3 text-sm leading-relaxed ${s.primary ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEGOTIATED DEALS */}
      <section className="py-16 md:py-28 bg-[image:var(--gradient-warm)] border-y border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Handshake className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Commission négociée</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-3xl text-balance">Chaque société de livraison, son propre accord.</h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Aucun tarif impose. Chaque partenaire negocie selon son volume, sa zone et sa structure: taux fixe, forfait, ou modele hybride. Cette flexibilite permet de scaler vite et de s'adapter au marche reel.
          </p>

          <div className="mt-10 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {deals.map((d, i) => (
              <div key={d.t} className="rounded-3xl bg-card p-7 border border-border shadow-[var(--shadow-card)] hover-lift animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black">{d.n}</span>
                <h3 className="mt-5 text-xl font-black">{d.t}</h3>
                <p className="mt-2 text-xl font-black text-primary">{d.v}</p>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{d.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-3">
            {["✔ Très flexible", "✔ Bon pour scaler", "✔ Adapté au marché réel"].map((t) => (
              <div key={t} className="px-5 py-4 rounded-2xl bg-card border border-border font-semibold text-sm sm:text-base text-foreground/80">{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* MODEL LOGIC */}
      <section className="py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Logique du modele</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance">Un modele clair et progressif.</h2>

          <p className="mt-8 sm:mt-10 text-muted-foreground max-w-2xl leading-relaxed">
            Le coeur du modele repose sur la commission de livraison negociee avec les partenaires. A cela peuvent s'ajouter des commissions marketplace et des services optionnels, selon le niveau de maturite de la plateforme.
          </p>

          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-[image:var(--gradient-hero)] text-primary-foreground flex items-start gap-4">
            <TrendingUp className="h-8 w-8 shrink-0" />
            <div>
              <h3 className="font-black text-lg sm:text-xl">Un modele leger a lancer.</h3>
              <p className="mt-2 text-primary-foreground/90 leading-relaxed">Le modele est volontairement agile: aucune flotte a acheter, aucun stock a gerer, aucune autorisation administrative speciale. On commence petit, on ameliore en continu avec le terrain.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
