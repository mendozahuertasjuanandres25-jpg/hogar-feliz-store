import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface Order {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string;
  total: number;
  status: string;
  created_at: string;
}

interface Item {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
}

const OrderConfirmation = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading || !user || !id) return;
    const load = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("id, full_name, email, phone, address, total, status, created_at")
        .eq("id", id)
        .maybeSingle();
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("id, product_name, unit_price, quantity, image_url")
        .eq("order_id", id);
      setOrder(orderData ?? null);
      setItems(itemsData ?? []);
      setFetching(false);
    };
    load();
  }, [id, user, loading]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {(loading || fetching) && <p className="text-muted-foreground">Cargando tu pedido...</p>}

        {!loading && !fetching && !order && (
          <Card className="shadow-card">
            <CardContent className="py-10 text-center space-y-4">
              <p className="text-muted-foreground">No encontramos este pedido en tu cuenta.</p>
              <Button asChild>
                <Link to="/">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {order && (
          <div className="space-y-6">
            <div className="text-center space-y-3 animate-fade-in-up">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
              <h1 className="font-display text-3xl font-bold text-foreground">
                ¡Gracias por tu compra, {order.full_name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Tu pedido quedó registrado y te vamos a contactar para coordinar el envío.
              </p>
              <p className="text-sm text-muted-foreground">
                Pedido <span className="font-mono font-semibold">#{order.id.slice(0, 8).toUpperCase()}</span> ·{" "}
                {new Date(order.created_at).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · Estado: {order.status}
              </p>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-xl">Detalle del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.product_name}
                      className="w-14 h-14 rounded-lg object-cover bg-muted"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x ${Number(item.unit_price).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      ${(Number(item.unit_price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-display text-xl font-bold">
                    ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-xl">Datos de envío</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">{order.full_name}</p>
                <p>{order.email}</p>
                {order.phone && <p>{order.phone}</p>}
                <p>{order.address}</p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link to="/">Seguir comprando</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/perfil">Ver mis pedidos</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
