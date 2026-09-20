import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/components/WhatsAppButton";
import { toast } from "sonner";

const Contacto = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setName(data.full_name ?? "");
        setPhone(data.phone ?? "");
      }
    };
    load();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user?.id ?? null,
      name,
      email,
      phone,
      subject,
      message,
    });
    setSending(false);
    if (error) {
      toast.error("No pudimos enviar tu mensaje. Intentá de nuevo.");
      return;
    }
    toast.success("¡Mensaje enviado! Te respondemos a la brevedad.");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Contacto</h1>
        <p className="text-muted-foreground mb-8">
          Dejanos tu mensaje y te respondemos dentro de las 24 horas hábiles.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Escribinos</CardTitle>
              <CardDescription>Tu mensaje queda registrado en nuestro sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">Otros canales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Chatear por WhatsApp
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" /> 0800-123-4567
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" /> info@megamarket.com
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" /> Av. Principal 1234, Buenos Aires, Argentina
              </div>
              <p className="text-xs text-muted-foreground">
                Atención: lunes a sábado de 9 a 20 h.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
