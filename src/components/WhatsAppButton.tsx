import { MessageCircle } from "lucide-react";

export const WHATSAPP_NUMBER = "5491123456789";

export const whatsappLink = (message = "¡Hola! Quiero consultar por un producto de MegaMarket.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const WhatsAppButton = () => (
  <a
    href={whatsappLink()}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Escribinos por WhatsApp"
    className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-card-hover hover:opacity-90 transition-all"
  >
    <MessageCircle className="w-5 h-5" />
    <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
  </a>
);

export default WhatsAppButton;
