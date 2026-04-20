import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { X, Check, Globe2 } from "lucide-react";

export const Route = createFileRoute("/vision")({
  component: Vision,
  head: () => ({
    meta: [
      { title: "Vision & positionnement — GoLivra" },
      { name: "description", content: "Le positionnement stratégique de GoLivra et sa vision long terme pour l'Afrique centrale." },
    ],
  }),
});

function Vision() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Positionnement & vision"
        title="GoLivra n'est pas ce que vous croyez."
        intro="Ni Uber Eats, ni Amazon, ni une simple société de livraison. GoLivra est l'infrastructure qui connecte commerce, clients et livraison — pour de vrai, ici."
      />

      {/* POSITIONING */}
      <section className="py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="rounded-3xl p-8 sm:p-10 bg-card border border-border animate-fade-up">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-3"><X className="h-6 w-6 text-destructive" /> GoLivra n'est pas</h2>
            <ul className="mt-6 space-y-4">
              {["Un Uber Eats", "Un Amazon complet", "Une entreprise de livraison"].map((x) => (
                <li key={x} className="flex items-center gap-3 text-base sm:text-lg text-foreground/70 line-through">
                  <X className="h-4 w-4 text-destructive/60" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl p-8 sm:p-10 bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)] animate-fade-up delay-100">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-3"><Check className="h-6 w-6" /> GoLivra est</h2>
            <p className="mt-6 text-xl sm:text-2xl md:text-3xl font-black leading-tight text-balance">
              Une infrastructure qui connecte commerce, clients et livraison — pensée pour le marché réel de Brazzaville et d'Afrique centrale.
            </p>
          </div>
        </div>
      </section>

      {/* LONG TERM */}
      <section className="py-16 md:py-28 bg-[image:var(--gradient-dark)] text-background">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe2 className="h-6 w-6 text-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Vision long terme</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-[1.05] text-balance">
            Si le projet réussit, GoLivra devient l'infrastructure du commerce d'Afrique centrale.
          </h2>
          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-5 sm:gap-6">
            {[
              "Plateforme de commerce locale dominante",
              "Réseau logistique digital de référence",
              "Extension vers le paiement mobile",
              "Expansion ville par ville en Afrique centrale",
            ].map((v, i) => (
              <div key={v} className="p-7 sm:p-8 rounded-3xl border border-background/10 bg-background/5 backdrop-blur hover:bg-background/10 transition-colors animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-xs font-bold tracking-widest text-accent">VISION 0{i + 1}</span>
                <p className="mt-3 text-xl sm:text-2xl font-bold">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONCLUSION */}
      <section className="py-16 md:py-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Conclusion</span>
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight text-balance">
            Une plateforme hybride. Un modèle clair. Une stratégie patiente.
          </h2>
          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            GoLivra combine marketplace, restaurants et livraison dans un seul système simple, adapté au marché réel de Brazzaville. Modèle économique basé sur la commission négociée avec chaque société de livraison, sans besoin d'autorisation administrative ni de gros capital pour démarrer.
          </p>
          <Link to="/contact" className="mt-8 sm:mt-10 inline-flex items-center px-7 sm:px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 hover:scale-[1.04] transition-all shadow-[var(--shadow-elegant)]">
            Rejoindre l'aventure
          </Link>
        </div>
      </section>
    </Layout>
  );
}
