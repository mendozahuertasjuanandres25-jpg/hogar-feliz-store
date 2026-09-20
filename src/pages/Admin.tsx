import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, Send } from "lucide-react";

const STATUSES = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];

interface OrderItem {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
}

interface Order {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

interface Reply {
  id: string;
  order_id: string;
  message: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(id, product_name, unit_price, quantity, image_url)")
      .order("created_at", { ascending: false });
    setOrders((data ?? []) as unknown as Order[]);
    const { data: rep } = await supabase
      .from("order_replies")
      .select("id, order_id, message, created_at")
      .order("created_at", { ascending: true });
    setReplies((rep ?? []) as Reply[]);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadOrders();
  }, [isAdmin]);

  const changeStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast.error("No se pudo cambiar el estado");
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    toast.success(`Pedido marcado como ${status}`);
  };

  const sendReply = async (orderId: string) => {
    const message = (drafts[orderId] ?? "").trim();
    if (!message || !user) return;
    const { data, error } = await supabase
      .from("order_replies")
      .insert({ order_id: orderId, author_id: user.id, message })
      .select("id, order_id, message, created_at")
      .single();
    if (error || !data) {
      toast.error("No se pudo enviar la respuesta");
      return;
    }
    setReplies((prev) => [...prev, data as Reply]);
    setDrafts((prev) => ({ ...prev, [orderId]: "" }));
    toast.success("Respuesta enviada al cliente");
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-muted-foreground">Cargando…</main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16">
          <h1 className="font-display text-2xl font-bold mb-2">Acceso restringido</h1>
          <p className="text-muted-foreground">
            Esta sección es solo para administradores de la tienda.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const totalVentas = orders.reduce((s, o) => s + Number(o.total), 0);
  const pendientes = orders.filter((o) => o.status === "pendiente").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Panel de administración</h1>
        <p className="text-muted-foreground mb-8">Todos los pedidos con sus productos, cantidades y estado.</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardDescription>Pedidos</CardDescription>
              <CardTitle className="font-display text-2xl">{orders.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardDescription>Pendientes</CardDescription>
              <CardTitle className="font-display text-2xl">{pendientes}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardDescription>Total vendido</CardDescription>
              <CardTitle className="font-display text-2xl">
                ${totalVentas.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {loadingOrders && <p className="text-muted-foreground">Cargando pedidos…</p>}
        {!loadingOrders && !orders.length && (
          <p className="text-muted-foreground">Todavía no hay pedidos guardados.</p>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-card">
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Pedido #{order.id.slice(0, 8)}
                  </CardTitle>
                  <CardDescription>
                    {new Date(order.created_at).toLocaleString()} · {order.full_name} · {order.email}
                    {order.phone ? ` · ${order.phone}` : ""}
                  </CardDescription>
                  <CardDescription>Envío: {order.address}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                  <Select value={order.status} onValueChange={(v) => changeStatus(order.id, v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.product_name}
                        className="w-12 h-12 rounded-lg object-cover bg-muted"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {item.quantity} · ${Number(item.unit_price).toLocaleString()} c/u
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        ${(Number(item.unit_price) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Total del pedido</span>
                  <span className="font-display text-lg font-bold">
                    ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  {replies
                    .filter((r) => r.order_id === order.id)
                    .map((r) => (
                      <div key={r.id} className="rounded-lg bg-muted px-3 py-2">
                        <p className="text-sm text-foreground whitespace-pre-line">{r.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(r.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  <Textarea
                    rows={3}
                    placeholder="Escribí una respuesta para el cliente…"
                    value={drafts[order.id] ?? ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))}
                  />
                  <Button size="sm" onClick={() => sendReply(order.id)} disabled={!(drafts[order.id] ?? "").trim()}>
                    <Send className="w-4 h-4 mr-1" /> Responder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
