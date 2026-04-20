import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { ShoppingBag, UtensilsCrossed, Bike, Layers } from "lucide-react";
import vendorImg from "@/assets/vendor.jpg";
import restaurantImg from "@/assets/restaurant.jpg";
import deliveryImg from "@/assets/delivery.jpg";

export const Route = createFileRoute("/solution")({
  component: Solution,
  head: () => ({
    meta: [
      { title: "Solution — GoLivra" },
      { name: "description", content: "Marketplace, restaurants et livraison à la demande : la plateforme tout-en-un de GoLivra." },
    ],
  }),
});

const blocks = [
  {
    icon: ShoppingBag,
    tag: "A. Marketplace",
    subtitle: "Cœur visibilité",
    img: vendorImg,
    text: "Les vendeurs peuvent publier leurs produits directement dans l'application : photos, description et disponibilite. Les clients peuvent parcourir, comparer, ajouter au panier et commander directement. Comme Amazon, mais local et simple.",
    bullets: ["Photos & descriptions", "Disponibilite", "Panier & commande directe", "Comparaison locale"],
  },
  {
    icon: UtensilsCrossed,
    tag: "B. Restaurants",
    subtitle: "Expérience client",
    img: restaurantImg,
    text: "Les restaurants peuvent afficher leur menu, recevoir des commandes directement dans l'app, gérer les commandes plus proprement que sur WhatsApp et envoyer les commandes en livraison.",
    bullets: ["Menu en ligne", "Commandes centralisées", "Gestion sans chaos", "Envoi en livraison"],
  },
  {
    icon: Bike,
    tag: "C. Livraison",
    subtitle: "Cœur opérationnel",
    img: deliveryImg,
    text: "GoLivra ne possède pas de livreurs. La plateforme connecte la demande à des livreurs ou sociétés existantes, à la volée : le vendeur valide une commande, clique « livraison », choisit une option disponible, la livraison est exécutée et le paiement effectué.",
    bullets: ["Réseau partenaires", "Demande à la volée", "Choix d'options", "Paiement intégré"],
  },
];

function Solution() {
  return (
    <Layout>
      <PageHeader
        eyebrow="La solution"
        title="Une plateforme. Trois systèmes. Un écosystème."
        intro="GoLivra est l'infrastructure digitale qui structure le commerce informel de Brazzaville en combinant marketplace, restaurants et livraison à la demande."
      />

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
          {blocks.map((b, i) => (
            <article key={b.tag} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="rounded-3xl overflow-hidden shadow-[var(--shadow-elegant)]">
                <img src={b.img} alt={b.tag} loading="lazy" width={1024} height={1024} className="w-full aspect-[4/3] object-cover" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">{b.subtitle}</span>
                <div className="flex items-center gap-3 mt-3">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <b.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black">{b.tag}</h2>
                </div>
                <p className="mt-5 text-lg text-foreground/80 leading-relaxed">{b.text}</p>
                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {b.bullets.map((x) => (
                    <li key={x} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* LOGIC */}
      <section className="py-20 md:py-28 bg-[image:var(--gradient-warm)] border-y border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Logique globale</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-3xl">GoLivra = trois couches qui s'enchaînent.</h2>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Commerce", d: "Marketplace de produits + restaurants." },
              { n: "02", t: "Commande", d: "Panier, validation et paiement." },
              { n: "03", t: "Livraison", d: "Exécution logistique via partenaires." },
            ].map((c) => (
              <div key={c.n} className="rounded-3xl bg-card p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="text-5xl font-black text-primary/20">{c.n}</div>
                <h3 className="mt-4 text-2xl font-black">{c.t}</h3>
                <p className="mt-2 text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MVP */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Produit minimum (MVP)</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">La version 1, simple et focalisée.</h2>
          <p className="mt-5 text-lg text-muted-foreground">Au lancement, GoLivra fait seulement ce qui est essentiel — rien de plus.</p>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {["Marketplace simple", "Ajout produit", "Commande", "Demande de livraison", "Statut livraison"].map((m, i) => (
              <div key={m} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border">
                <span className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center">{i + 1}</span>
                <span className="font-semibold text-lg">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
