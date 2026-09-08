import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  rating: number | null;
  categories: { name: string } | null;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, original_price, image_url, rating, categories(name)")
        .eq("featured", true)
        .limit(8);
      if (data) setProducts(data as unknown as Product[]);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Productos destacados
            </h2>
            <p className="text-muted-foreground mt-1">Las mejores ofertas seleccionadas para vos</p>
          </div>
          <button className="hidden md:inline-flex px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-card transition-colors">
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price}
                imageUrl={product.image_url}
                rating={product.rating}
                categoryName={product.categories?.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
