"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/golivra-logo.png";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/solution", label: "Solution" },
  { to: "/marche", label: "Marché" },
  { to: "/modele", label: "Modèle" },
  { to: "/strategie", label: "Stratégie" },
  { to: "/vision", label: "Vision" },
] as const;

export function Navbar() {
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const details = mobileDetailsRef.current;
      if (!details?.open) return;

      const target = event.target;
      if (!(target instanceof Node)) return;
      if (details.contains(target)) return;

      details.open = false;
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, []);
  const closeMobileMenu = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return;
    const details = target.closest("details");
    if (!(details instanceof HTMLDetailsElement)) return;
    details.open = false;
  };

  return (
    <header className="sticky top-0 z-[300] backdrop-blur-xl bg-background/85 border-b border-border/60">
      <nav className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center group" aria-label="GoLivra accueil">
          <img src={logo} alt="GoLivra" className="h-11 sm:h-12 w-auto group-hover:scale-105 transition-transform duration-300" />
        </Link>
        <div className="hidden xl:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-3.5 py-2 text-sm font-medium rounded-lg text-foreground/70 hover:text-primary hover:bg-muted transition-colors" activeProps={{ className: "px-3.5 py-2 text-sm font-medium rounded-lg text-primary bg-muted" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link to="/contact" className="hidden xl:inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hover:scale-[1.03] transition-all shadow-[var(--shadow-soft)]">Devenir partenaire</Link>
        <div className="relative z-[310] xl:hidden">
          <details ref={mobileDetailsRef} className="group relative">
            <summary
              className="relative z-[320] h-10 px-3 list-none cursor-pointer pointer-events-auto touch-manipulation inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/90 shadow-[var(--shadow-card)] hover:bg-muted transition-colors [&::-webkit-details-marker]:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5 group-open:hidden" />
              <X className="hidden h-5 w-5 group-open:block" />
              <span className="text-xs font-semibold">Menu</span>
            </summary>
            <button
              type="button"
              aria-label="Fermer le menu mobile"
              onClick={(e) => closeMobileMenu(e.currentTarget)}
              className="fixed inset-0 top-16 z-[305] hidden bg-black/20 backdrop-blur-[1px] group-open:block"
            />
            <div
              id="mobile-menu"
              className="fixed left-0 right-0 top-16 z-[310] hidden w-screen max-h-[calc(100dvh-4rem)] overflow-y-auto border-y border-border/70 bg-background/95 backdrop-blur p-3 shadow-[var(--shadow-elegant)] animate-fade-in group-open:block"
            >
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={(e) => closeMobileMenu(e.currentTarget)}
                    className="px-3 py-3 rounded-lg text-foreground/80 hover:bg-muted font-medium"
                    activeProps={{ className: "px-3 py-3 rounded-lg text-primary bg-muted font-semibold" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  onClick={(e) => closeMobileMenu(e.currentTarget)}
                  className="mt-2 px-3 py-3 rounded-lg bg-primary text-primary-foreground text-center font-semibold"
                >
                  Devenir partenaire
                </Link>
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
