import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Store } from "lucide-react";
import Footer from "@/components/Footer";
import juguetesImg from "@/assets/juguetes.jpg";
import electronicosImg from "@/assets/electronicos.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de nuevo!");
        navigate("/", { replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Revisá tu correo para confirmar la cuenta.");
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrió un error";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          {/* Visual panel */}
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <Link to="/juguetes" className="group relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={juguetesImg}
                alt="Juguetes en venta"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-56 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/40 flex items-end p-4">
                <span className="font-display font-bold text-card">Juguetes</span>
              </div>
            </Link>
            <Link to="/electronicos" className="group relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={electronicosImg}
                alt="Dispositivos electrónicos en venta"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-56 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/40 flex items-end p-4">
                <span className="font-display font-bold text-card">Electrónicos</span>
              </div>
            </Link>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <Card className="w-full max-w-md shadow-card">
              <CardHeader className="text-center">
                <Link to="/" className="mx-auto mb-3 w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <Store className="w-7 h-7 text-primary-foreground" />
                </Link>
                <CardTitle className="font-display text-2xl">
                  {mode === "login" ? "Iniciá sesión" : "Creá tu cuenta"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Accedé a tu cuenta de MegaMarket"
                    : "Registrate para comprar más rápido"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Procesando..." : mode === "login" ? "Ingresar" : "Registrarme"}
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {mode === "login" ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Iniciá sesión"}
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
