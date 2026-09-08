import { Search, Menu, Store, LogIn, LogOut, User as UserIcon, Home, Gamepad2, Smartphone } from "lucide-react";
import CartSheet from "@/components/CartSheet";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name, slug");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-navbar backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Hamburger + Logo */}
          <div className="flex items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Abrir menú"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Menu className="w-5 h-5 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 flex flex-col">
                <SheetHeader>
                  <SheetTitle className="font-display">Menú</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6 overflow-y-auto">
                  <div className="space-y-1">
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Home className="w-4 h-4" /> Inicio
                    </Link>
                    <Link
                      to="/juguetes"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4" /> Juguetes
                    </Link>
                    <Link
                      to="/electronicos"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Smartphone className="w-4 h-4" /> Dispositivos electrónicos
                    </Link>
                    {user ? (
                      <>
                        <Link
                          to="/perfil"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <UserIcon className="w-4 h-4" /> Editar perfil
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <LogIn className="w-4 h-4" /> Iniciar sesión
                      </Link>
                    )}
                  </div>

                  <div>
                    <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Categorías
                    </p>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/?categoria=${cat.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Store className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                MegaMarket
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/perfil">
                  <UserIcon className="w-4 h-4 mr-1" /> Mi perfil
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-1" /> Iniciar sesión
                </Link>
              </Button>
            )}
            <CartSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
