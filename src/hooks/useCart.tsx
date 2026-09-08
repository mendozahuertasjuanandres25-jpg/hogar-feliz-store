import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  setQuantity: () => {},
  clear: () => {},
});

const STORAGE_KEY = "megamarket_cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} agregado al carrito`);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const setQuantity = (id: string, quantity: number) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );

  const clear = () => setItems([]);

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((s, i) => s + i.quantity, 0),
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, setQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
