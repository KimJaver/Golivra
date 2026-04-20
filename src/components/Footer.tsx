import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import logo from "@/assets/golivra-logo.png";

export function Footer() {
  return (
    <footer className="mt-24 md:mt-32 bg-[image:var(--gradient-dark)] text-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="sm:col-span-2">
          <div className="mb-4 inline-block bg-background rounded-2xl p-3">
            <img src={logo} alt="GoLivra" className="h-12 w-auto" />
          </div>
          <p className="text-background/70 max-w-md leading-relaxed">
            L'infrastructure digitale qui connecte commerce, restaurants et livraison à Brazzaville — puis dans toute l'Afrique centrale.
          </p>
          <a
            href="https://wa.me/242067811462"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold hover:scale-105 transition-transform text-sm"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp : +242 06 781 14 62
          </a>
        </div>
        <div>
          <h4 className="font-bold mb-4">Plateforme</h4>
          <ul className="space-y-2 text-background/70 text-sm">
            <li><Link to="/solution" className="hover:text-accent transition-colors">Solution</Link></li>
            <li><Link to="/marche" className="hover:text-accent transition-colors">Marché</Link></li>
            <li><Link to="/modele" className="hover:text-accent transition-colors">Modèle économique</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Projet</h4>
          <ul className="space-y-2 text-background/70 text-sm">
            <li><Link to="/strategie" className="hover:text-accent transition-colors">Stratégie</Link></li>
            <li><Link to="/vision" className="hover:text-accent transition-colors">Vision</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Devenir partenaire</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 text-xs sm:text-sm text-background/50">
          <p>2026 GoLivra</p>
        </div>
      </div>
    </footer>
  );
}
