import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

const CartSheet = () => {
  const { items, count, total, setQuantity, removeItem, clear } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Carrito">
          <ShoppingCart className="w-5 h-5 text-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
            {count}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display">Tu carrito</SheetTitle>
        </SheetHeader>

        {!items.length ? (
          <p className="mt-8 text-muted-foreground">Todavía no agregaste productos.</p>
        ) : (
          <>
            <div className="mt-6 flex-1 overflow-y-auto space-y-4 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-muted"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        aria-label="Quitar uno"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded border border-border hover:bg-muted"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        aria-label="Agregar uno"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded border border-border hover:bg-muted"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        aria-label="Eliminar"
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded border border-border hover:bg-muted ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold text-foreground">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  navigate("/compra");
                }}
              >
                Completar compra
              </Button>
              <Button variant="ghost" className="w-full" onClick={clear}>
                Vaciar carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
