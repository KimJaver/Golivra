import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { MapPin, MessageCircle, Phone, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Devenir partenaire — GoLivra" },
      { name: "description", content: "Contactez l'équipe GoLivra sur WhatsApp pour devenir partenaire vendeur, restaurant, livreur ou investisseur." },
    ],
  }),
});

const WHATSAPP_NUMBER = "+242 06 781 14 62";
const WHATSAPP_LINK = "https://wa.me/242067811462";

function Contact() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Devenir partenaire"
        title="Construisons ensemble."
        intro="Vendeur en ligne, e-commerçant, boutique physique, restaurant, livreur ou investisseur — écrivez-nous directement sur WhatsApp."
      />
      <section className="py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* WHATSAPP CTA */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-8 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[2.5rem] bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:scale-[1.01] transition-transform animate-fade-up"
          >
            <div className="flex items-center gap-3 mb-5">
              <MessageCircle className="h-7 w-7" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Contact direct</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight text-balance">
              Discutons sur WhatsApp.
            </h2>
            <p className="mt-5 text-base sm:text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Le moyen le plus rapide d'échanger avec l'équipe GoLivra. Pas de formulaire, pas d'attente — un message et on parle.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 px-6 sm:px-8 py-4 rounded-full bg-background text-foreground font-bold group-hover:gap-5 transition-all">
              {WHATSAPP_NUMBER} <ArrowRight className="h-5 w-5" />
            </div>
          </a>

          {/* INFO CARDS */}
          <div className="mt-8 sm:mt-10 grid sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: MessageCircle, t: "WhatsApp", d: WHATSAPP_NUMBER, href: WHATSAPP_LINK },
              { icon: Phone, t: "Téléphone", d: WHATSAPP_NUMBER, href: `tel:+242067811462` },
              { icon: MapPin, t: "Localisation", d: "Brazzaville, Congo" },
            ].map((c, i) => {
              const Inner = (
                <>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{c.t}</p>
                  <p className="mt-1 font-bold text-foreground">{c.d}</p>
                </>
              );
              return c.href ? (
                <a
                  key={c.t}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-card border border-border hover-lift animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {Inner}
                </a>
              ) : (
                <div key={c.t} className="p-6 rounded-2xl bg-card border border-border animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  {Inner}
                </div>
              );
            })}
          </div>

          {/* WHO */}
          <div className="mt-12 sm:mt-16 p-8 sm:p-10 rounded-3xl bg-[image:var(--gradient-warm)] border border-border">
            <h3 className="text-xl sm:text-2xl font-black">Qui peut nous contacter ?</h3>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {[
                "E-commerçants vendant sur Facebook, Instagram, TikTok",
                "Boutiques physiques voulant aller en ligne",
                "Restaurants & cuisines à domicile",
                "Sociétés et indépendants de livraison",
                "Partenaires & investisseurs",
                "Toute personne intéressée par le projet",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3 text-foreground/80">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm sm:text-base">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
