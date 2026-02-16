import heroBanner from "@/assets/hero-banner.jpg";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-[420px] md:h-[480px]">
        <img
          src={heroBanner}
          alt="MegaMarket - Todo lo que necesitás en un solo lugar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-4 animate-fade-in-up">
                🔥 Ofertas hasta 50% OFF
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-card mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Todo lo que necesitás,{" "}
                <span className="text-secondary">al mejor precio</span>
              </h1>
              <p className="text-card/80 text-lg mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Juguetes, electrónica, muebles y mucho más. Envío gratis en miles de productos.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-all animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Ver ofertas
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 justify-center">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Envío gratis desde $50</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Garantía en todos los productos</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Hasta 12 cuotas sin interés</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
