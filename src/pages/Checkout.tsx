import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Checkout = () => {
  const { user, loading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setAddress(data.address ?? "");
      }
    };
    load();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !items.length) return;
    setSaving(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({ user_id: user.id, full_name: fullName, email, phone, address, total })
      .select("id")
      .single();

    if (error || !order) {
      setSaving(false);
      toast.error(error?.message ?? "No se pudo crear el pedido");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        product_name: i.name,
        unit_price: i.price,
        quantity: i.quantity,
        image_url: i.image_url,
      }))
    );

    setSaving(false);
    if (itemsError) {
      toast.error(itemsError.message);
      return;
    }
    clear();
    toast.success("¡Compra confirmada! Te contactaremos para el envío.");
    navigate(`/pedido/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Datos de envío</CardTitle>
            <CardDescription>Usamos tus datos guardados para completar la compra.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
                <Label htmlFor="address">Dirección de envío</Label>
                <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <Button type="submit" disabled={saving || !items.length} className="w-full">
                {saving ? "Procesando..." : "Confirmar compra"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Tu pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!items.length && <p className="text-muted-foreground">Tu carrito está vacío.</p>}
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-muted"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} x ${item.price.toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            {!!items.length && (
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
