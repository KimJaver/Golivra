import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import heroImg from "@/assets/hero-brazzaville.jpg";
import vendorImg from "@/assets/vendor.jpg";
import deliveryImg from "@/assets/delivery.jpg";
import restaurantImg from "@/assets/restaurant.jpg";
import appMockup from "@/assets/app-mockup.jpg";
import { ShoppingBag, UtensilsCrossed, Bike, ArrowRight, MapPin, Sparkles, Store, Globe, Zap, ShieldCheck, Smartphone, Search, Package, Bell, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "GoLivra — Marketplace, restaurants & livraison à Brazzaville" },
      { name: "description", content: "GoLivra connecte vendeurs, restaurants et livreurs de Brazzaville dans une seule plateforme simple et fiable." },
      { property: "og:title", content: "GoLivra — Le commerce de Brazzaville, enfin connecté" },
      { property: "og:description", content: "Marketplace + restaurants + livraison à la demande. Une infrastructure digitale pour le commerce local." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
});

function Home() {
  const buildWhatsAppMessage = (userMessage: string) => {
    const cleanMessage = userMessage.trim();
    if (!cleanMessage) return "";

    return [
      "Bonjour equipe GoLivra,",
      "",
      "Je vous envoie mon avis concernant le projet :",
      cleanMessage,
      "",
      "Merci pour votre travail et bravo pour l'initiative.",
      "Cordialement,",
      "Un utilisateur GoLivra",
      "",
      "Note: Concept original GoLivra. Idee et contenu proteges - Copyright GoLivra.",
    ].join("\n");
  };

  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userMessage = String(formData.get("text") ?? "");
    const fullMessage = buildWhatsAppMessage(userMessage);
    if (!fullMessage) return;
    const encoded = encodeURIComponent(fullMessage);
    window.location.assign(`https://wa.me/242067811462?text=${encoded}`);
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Marché animé de Brazzaville" width={1920} height={1280} className="w-full h-full object-cover scale-105 animate-fade-in" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/65 to-foreground/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-24 sm:py-32 md:py-44">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/15 backdrop-blur text-background border border-background/20 text-xs font-semibold animate-fade-in">
              <MapPin className="h-3.5 w-3.5" /> Brazzaville · puis l'Afrique centrale
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-background leading-[1.02] text-balance animate-fade-up delay-100">
              Le commerce<br />de Brazzaville,<br />
              <span className="text-accent">enfin connecté.</span>
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-background/85 leading-relaxed max-w-xl animate-fade-up delay-200">
              GoLivra réunit la marketplace, les restaurants et la livraison à la demande dans une seule plateforme simple, fiable et locale — pour les e-commerçants, les boutiques physiques et tous ceux qui vendent en ligne.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 animate-fade-up delay-300">
              <Link to="/solution" className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-95 hover:scale-[1.03] shadow-[var(--shadow-elegant)] transition-all">
                Découvrir la solution <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/modele" className="inline-flex items-center px-6 sm:px-7 py-3.5 rounded-full bg-background/10 backdrop-blur border border-background/30 text-background font-semibold hover:bg-background/20 transition">
                Voir le modèle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP SHOWCASE */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-primary">
              <Smartphone className="h-4 w-4" /> Application mobile
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-balance">
              Toute la plateforme, dans une seule app.
            </h2>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              GoLivra est avant tout une application mobile, pensée pour fonctionner même avec une connexion modeste. Trois expériences en une : acheter, vendre, livrer.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Search, t: "Découvrir & commander", d: "Parcourir produits et menus, ajouter au panier, payer en quelques clics." },
                { icon: Package, t: "Gérer ses ventes", d: "Espace vendeur intégré : produits, stock, commandes reçues, statuts." },
                { icon: Bell, t: "Suivre la livraison", d: "Notifications en temps réel, suivi du livreur, preuve de livraison." },
              ].map((f, i) => (
                <div key={f.t} className="flex gap-4 p-4 rounded-2xl hover:bg-muted/60 transition-colors animate-slide-in-left" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{f.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-bold border border-secondary/20">📱 Android</span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">📱 iOS</span>
              <span className="px-4 py-2 rounded-full bg-muted text-foreground/70 text-xs font-bold">⚡ Léger & rapide</span>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative animate-scale-in">
            <div className="absolute -inset-8 bg-[image:var(--gradient-hero)] opacity-20 blur-3xl rounded-full" />
            <img
              src={appMockup}
              alt="Application mobile GoLivra : marketplace, suivi de livraison et menu restaurant"
              loading="lazy"
              width={1200}
              height={896}
              className="relative w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* KEY FACTS — pas besoin d'autorisation, petit capital */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, t: "Aucune autorisation requise", d: "Le projet ne nécessite ni licence spéciale ni accord administratif pour démarrer." },
            { icon: Zap, t: "Petit capital de départ", d: "Pas besoin d'un grand investissement — on commence léger, on grandit avec les revenus." },
            { icon: Globe, t: "Brazzaville → puis ailleurs", d: "On vise tout Brazzaville d'abord, puis d'autres villes du Congo et d'Afrique centrale." },
          ].map((c, i) => (
            <div key={c.t} className={`p-6 rounded-2xl bg-card border border-border hover-lift animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
              <c.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-bold text-lg">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Le problème</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-balance">
              Un commerce vivant,<br />mais désorganisé.
            </h2>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              À Brazzaville, le commerce fonctionne déjà — mais sur Facebook, TikTok et WhatsApp. Les commandes sont manuelles, la livraison improvisée, et aucun système central ne fiabilise tout cela.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Les vendeurs vendent via les réseaux sociaux",
                "Les restaurants prennent les commandes à la main",
                "Les clients doivent négocier et appeler",
                "La livraison est toujours improvisée",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-foreground/80">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { n: "↓", l: "Perte de clients" },
              { n: "⏱", l: "Perte de temps" },
              { n: "✗", l: "Erreurs de livraison" },
              { n: "?", l: "Manque de confiance" },
            ].map((c, i) => (
              <div key={c.l} className="aspect-square rounded-3xl bg-card border border-border p-5 sm:p-6 flex flex-col justify-between shadow-[var(--shadow-card)] hover-lift animate-scale-in" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="text-4xl sm:text-5xl font-black text-primary">{c.n}</span>
                <p className="font-semibold text-sm sm:text-base text-foreground">{c.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="py-20 md:py-32 bg-[image:var(--gradient-warm)] border-y border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">La solution</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance">Trois systèmes, un seul écosystème.</h2>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground">GoLivra combine marketplace, restaurants et livraison dans une plateforme unique pensée pour le marché réel — e-commerçants, vendeurs en ligne et boutiques physiques.</p>
          </div>
          <div className="mt-12 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: ShoppingBag, title: "Marketplace", img: vendorImg, desc: "Les vendeurs publient leurs produits avec photos, details et stock. Les clients commandent en quelques clics.", tag: "Cœur visibilité" },
              { icon: UtensilsCrossed, title: "Restaurants", img: restaurantImg, desc: "Les restaurants gèrent leur menu et reçoivent les commandes proprement, sans le chaos de WhatsApp.", tag: "Expérience" },
              { icon: Bike, title: "Livraison", img: deliveryImg, desc: "Une demande, une option, une livraison. GoLivra connecte vendeurs et livreurs partenaires en temps réel.", tag: "Cœur opérationnel" },
            ].map((p, i) => (
              <article key={p.title} className="group rounded-3xl overflow-hidden bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-500 hover:-translate-y-2 animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy" width={1024} height={768} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 sm:p-7">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-primary">{p.tag}</span>
                  <div className="flex items-center gap-3 mt-2">
                    <p.icon className="h-6 w-6 text-secondary" />
                    <h3 className="text-xl sm:text-2xl font-black">{p.title}</h3>
                  </div>
                  <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHOM — focus e-commerçants & boutiques */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Pour qui ?</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance">Pensé pour ceux qui vendent déjà.</h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: ShoppingBag, t: "E-commerçants en ligne", d: "Vous vendez sur Facebook, Instagram ou TikTok ? GoLivra centralise vos commandes et gère la livraison à votre place." },
              { icon: Store, t: "Boutiques physiques", d: "Votre boutique existe déjà ? Ajoutez vos produits sur GoLivra et touchez tout Brazzaville sans changer votre activité." },
              { icon: UtensilsCrossed, t: "Restaurants & cuisines", d: "Recevez des commandes structurées, gérez votre menu, et envoyez en livraison sans gérer vous-même les livreurs." },
            ].map((p, i) => (
              <div key={p.t} className="p-7 rounded-3xl bg-card border border-border hover-lift animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-black">{p.t}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 md:py-24 bg-[image:var(--gradient-warm)] border-y border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { n: "3", l: "couches intégrées" },
              { n: "100%", l: "modele base sur commissions" },
              { n: "1", l: "ville d'abord" },
              { n: "∞", l: "potentiel d'expansion" },
            ].map((s, i) => (
              <div key={s.l} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-primary">{s.n}</div>
                <p className="mt-2 text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 md:p-20 bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)] relative overflow-hidden">
            <Sparkles className="absolute top-6 right-6 sm:top-8 sm:right-8 h-24 sm:h-32 w-24 sm:w-32 text-background/10 animate-float" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-2xl leading-tight text-balance">
              Construisons ensemble le commerce de demain.
            </h2>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-primary-foreground/90 max-w-xl">
              Vendeur, restaurant, livreur ou partenaire — rejoignez la première infrastructure digitale du commerce à Brazzaville.
            </p>
            <Link to="/contact" className="mt-8 sm:mt-10 inline-flex items-center gap-2 px-7 sm:px-8 py-4 rounded-full bg-background text-foreground font-bold hover:scale-[1.04] transition-transform">
              Devenir partenaire <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-card border border-border p-7 sm:p-10 shadow-[var(--shadow-card)] animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-primary">
              <MessageCircle className="h-4 w-4" /> Votre avis
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-balance">
              Dites-nous ce que vous pensez du projet GoLivra.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Ecrivez votre avis ci-dessous. Votre message sera envoye directement sur le WhatsApp de GoLivra.
            </p>

            <form
              onSubmit={handleFeedbackSubmit}
              action="https://wa.me/242067811462"
              method="get"
              target="_blank"
              className="mt-6"
            >
              <textarea
                name="text"
                placeholder="Votre avis..."
                required
                className="w-full min-h-36 rounded-2xl border border-border bg-background px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-95 transition"
              >
                Envoyer via WhatsApp <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
