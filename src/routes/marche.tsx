import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { TrendingUp, Users, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/marche")({
  component: Marche,
  head: () => ({
    meta: [
      { title: "Marché & défis — GoLivra" },
      { name: "description", content: "Le marché de Brazzaville, les phases de croissance et les défis anticipés par GoLivra." },
    ],
  }),
});

const phases = [
  { tag: "Phase 1", period: "0 – 3 mois", items: ["10 vendeurs", "5 restaurants", "3 partenaires livraison", "30 – 80 livraisons / jour"] },
  { tag: "Phase 2", period: "3 – 9 mois", items: ["50 vendeurs", "20 restaurants", "10 partenaires livraison", "150 – 300 livraisons / jour"] },
  { tag: "Phase 3", period: "1 – 2 ans", items: ["Couverture totale Brazzaville", "100+ vendeurs actifs", "Réseau stable", "Préparation autres villes"] },
];

const challenges = [
  {
    t: "Marketplace vide au début",
    p: "Une marketplace sans produits ne sert à rien. Si on lance avec rien à acheter, personne ne reste.",
    s: "Démarrer petit avec 10–20 vendeurs sélectionnés à la main, qui apportent déjà leur clientèle. Construire l'offre avant la demande.",
  },
  {
    t: "Mauvaise livraison = mauvaise réputation",
    p: "Une seule livraison ratée peut détruire la confiance d'un client pour toujours, surtout dans un marché basé sur le bouche-à-oreille.",
    s: "Sélection rigoureuse des partenaires livraison. Notation, traçabilité, et exclusion rapide des mauvais éléments.",
  },
  {
    t: "Manque de confiance des clients",
    p: "Les Brazzavillois sont habitués à voir, toucher, négocier. Acheter en ligne sans confiance, c'est impossible.",
    s: "Preuve de livraison systématique (photo), paiement à la livraison possible, transparence totale sur les vendeurs et avis clients.",
  },
  {
    t: "Complexité technique excessive",
    p: "Trop de fonctionnalités au lancement = bugs, lenteurs, abandon. Les utilisateurs n'ont pas la patience d'apprendre une app compliquée.",
    s: "MVP ultra-simple : voir, commander, recevoir. C'est tout. On ajoute les fonctionnalités après preuve d'usage.",
  },
  {
    t: "Déséquilibre offre / demande",
    p: "Trop de vendeurs sans clients = vendeurs frustrés. Trop de clients sans livreurs = clients déçus. Il faut équilibrer en permanence.",
    s: "Croissance contrôlée par zone géographique. On sature un quartier avant d'ouvrir le suivant.",
  },
  {
    t: "Concurrence des réseaux sociaux",
    p: "Facebook, WhatsApp et TikTok sont gratuits et déjà installés. Pourquoi changer ?",
    s: "GoLivra ne remplace pas — il complète. Le vendeur garde ses canaux, mais gagne en livraison, gestion et visibilité supplémentaire.",
  },
];

function Marche() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Marché & défis"
        title="Une croissance pensée, ville par ville."
        intro="Plutôt que de viser tout le pays d'un coup, GoLivra construit un réseau dense, fiable et profitable à Brazzaville d'abord, puis dans d'autres villes."
      />

      {/* TARGET */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Cible géographique</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance">Tout Brazzaville d'abord. Puis le reste.</h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            On ne se limite pas à un quartier — on vise toute la ville de Brazzaville dès la phase de croissance. Une fois le modèle prouvé et le réseau stable, on ouvre Pointe-Noire, puis d'autres villes du Congo et d'Afrique centrale.
          </p>
        </div>
      </section>

      {/* PHASES */}
      <section className="py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Estimation utilisateurs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-3xl text-balance">Trois phases réalistes.</h2>
          <div className="mt-10 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {phases.map((p, i) => (
              <div key={p.tag} className={`rounded-3xl p-7 sm:p-8 border hover-lift animate-fade-up ${i === 1 ? "bg-secondary text-secondary-foreground border-secondary shadow-[var(--shadow-elegant)]" : "bg-card border-border shadow-[var(--shadow-card)]"}`} style={{ animationDelay: `${i * 120}ms` }}>
                <span className={`text-xs font-bold tracking-widest uppercase ${i === 1 ? "text-accent" : "text-primary"}`}>{p.tag}</span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black">{p.period}</h3>
                <ul className="mt-5 sm:mt-6 space-y-3">
                  {p.items.map((x) => (
                    <li key={x} className={`flex gap-3 text-sm sm:text-base ${i === 1 ? "text-secondary-foreground/90" : "text-foreground/80"}`}>
                      <Users className="h-4 w-4 mt-1 shrink-0 opacity-60" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHALLENGES */}
      <section className="py-16 md:py-28 bg-[image:var(--gradient-warm)] border-y border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Défis & solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-3xl text-balance">Anticiper, ne pas subir.</h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Chaque défi a été identifié et a sa contre-mesure. Voici les six obstacles majeurs et comment GoLivra les neutralise.
          </p>

          <div className="mt-10 space-y-4 sm:space-y-5">
            {challenges.map((c, i) => (
              <div key={c.t} className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] hover-lift animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-primary/30 shrink-0">0{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <h3 className="font-black text-lg sm:text-xl">{c.t}</h3>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 md:pl-12">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Le défi</span>
                    <p className="mt-2 text-foreground/80 leading-relaxed text-sm sm:text-base">{c.p}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">Notre réponse</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">{c.s}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
