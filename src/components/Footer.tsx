import { Link } from "react-router-dom";
import { Store, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-card">
      {/* Newsletter */}
      <div className="border-b border-card/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold">Suscribite a nuestro newsletter</h3>
              <p className="text-card/60 text-sm">Recibí ofertas exclusivas y novedades</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 md:w-72 px-4 py-2.5 rounded-lg bg-card/10 border border-card/10 text-sm text-card placeholder:text-card/40 focus:outline-none focus:border-secondary"
              />
              <button className="px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-all whitespace-nowrap">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Store className="w-6 h-6 text-secondary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">MegaMarket</span>
            </div>
            <p className="text-card/60 text-sm leading-relaxed mb-4">
              Tu destino de compras online. Los mejores productos al mejor precio con envío a todo el país.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-card/10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-bold mb-4">Categorías</h4>
            <ul className="space-y-2.5 text-sm text-card/60">
              <li>
                <Link to="/juguetes" className="hover:text-secondary transition-colors">Juguetes</Link>
              </li>
              <li>
                <Link to="/electronicos" className="hover:text-secondary transition-colors">Dispositivos electrónicos</Link>
              </li>
              {[
                { name: "Electrodomésticos", slug: "electrodomesticos" },
                { name: "Muebles", slug: "muebles" },
                { name: "Celulares", slug: "celulares" },
                { name: "Tablets", slug: "tablets" },
                { name: "Televisores", slug: "televisores" },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/?categoria=${cat.slug}`} className="hover:text-secondary transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display font-bold mb-4">Ayuda</h4>
            <ul className="space-y-2.5 text-sm text-card/60">
              <li>
                <Link to="/contacto" className="hover:text-secondary transition-colors">Contacto</Link>
              </li>
              {["Centro de ayuda", "Cómo comprar", "Envíos y entregas", "Devoluciones", "Medios de pago"].map((item) => (
                <li key={item}>
                  <Link to="/contacto" className="hover:text-secondary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold mb-4">Contacto</h4>
            <div className="space-y-3 text-sm text-card/60">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span>0800-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span>info@megamarket.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <span>Av. Principal 1234, Buenos Aires, Argentina</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="mt-6">
              <h5 className="text-xs font-semibold uppercase tracking-wider mb-3 text-card/40">Medios de pago</h5>
              <div className="flex flex-wrap gap-2">
                {["Visa", "MC", "Amex", "MP"].map((m) => (
                  <span key={m} className="px-3 py-1.5 rounded bg-card/10 text-xs font-medium">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-card/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-xs text-card/40">
            © 2026 MegaMarket. Todos los derechos reservados. Hecho con ❤️ en Argentina.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
