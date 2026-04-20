import { useEffect, useState } from "react";
import { useLocation, useRouterState } from "@tanstack/react-router";
import { ChevronUp } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isNavigating = useRouterState({
    select: (state) => state.isLoading || state.isTransitioning,
  });
  const [showNavLoader, setShowNavLoader] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      setShowNavLoader(true);
      const maxLoaderTimer = window.setTimeout(() => {
        setShowNavLoader(false);
      }, 1500);
      return () => window.clearTimeout(maxLoaderTimer);
    }

    const settleTimer = window.setTimeout(() => {
      setShowNavLoader(false);
    }, 150);
    return () => window.clearTimeout(settleTimer);
  }, [isNavigating]);

  useEffect(() => {
    const revealSelector = ".animate-fade-up, .animate-fade-in, .animate-scale-in, .animate-slide-in-left";
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    elements.forEach((el) => {
      el.classList.remove("reveal-visible");
      el.classList.add("reveal-pending");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);


  return (
    <div id="page-top" className="min-h-screen flex flex-col">
      <div className={`nav-loader ${showNavLoader ? "nav-loader-active" : ""}`} aria-hidden="true" />
      <Navbar />
      <main className="flex-1 route-shell">{children}</main>
      <a
        href="#page-top"
        aria-label="Revenir en haut"
        className="fixed bottom-4 right-4 z-[9999] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-[var(--shadow-elegant)] backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-primary/90 md:bottom-6 md:right-6 md:h-12 md:w-12"
      >
        <ChevronUp className="mx-auto h-5 w-5" />
      </a>
      <Footer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="bg-[image:var(--gradient-warm)] border-b border-border overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-28">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 animate-fade-in">{eyebrow}</span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.05] text-balance animate-fade-up">{title}</h1>
        {intro && <p className="mt-5 md:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed animate-fade-up delay-100">{intro}</p>}
      </div>
    </section>
  );
}
