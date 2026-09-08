import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  address: string;
  order_items: OrderItem[];
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
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
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, total, status, created_at, address, order_items(id, product_name, quantity, unit_price, image_url)")
        .order("created_at", { ascending: false });
      if (ordersData) setOrders(ordersData as unknown as Order[]);
    };
    load();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, phone, address });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Perfil actualizado");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 space-y-8">
        <Card className="max-w-xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Mis datos</CardTitle>
            <CardDescription>
              Estos datos se usan para completar tus compras y coordinar el envío.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" value={user?.email ?? ""} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección de envío</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="max-w-xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Mis pedidos</CardTitle>
            <CardDescription>Historial de tus compras.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!orders.length && <p className="text-muted-foreground">Todavía no hiciste compras.</p>}
            {orders.map((order) => (
              <div key={order.id} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.address}</p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium capitalize">
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.product_name}
                        className="w-10 h-10 rounded object-cover bg-muted"
                        loading="lazy"
                      />
                      <p className="flex-1 text-sm line-clamp-1">{item.product_name}</p>
                      <span className="text-xs text-muted-foreground">
                        {item.quantity} x ${item.unit_price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Total</span>
                  <span className="font-display font-bold">
                    ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
