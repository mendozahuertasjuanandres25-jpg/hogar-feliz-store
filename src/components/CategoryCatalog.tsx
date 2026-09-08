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
  categories: { name: string; slug: string } | null;
}

interface Props {
  slugs: string[];
  title: string;
  subtitle: string;
  heroImage: string;
  showFilters?: boolean;
}

const CategoryCatalog = ({ slugs, title, subtitle, heroImage, showFilters }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, slug")
        .in("slug", slugs);
      if (!cats?.length) return;
      const ids = cats.map((c) => c.id);
      const { data } = await supabase
        .from("products")
        .select("id, name, price, original_price, image_url, rating, categories(name, slug)")
        .in("category_id", ids);
      if (data) setProducts(data as unknown as Product[]);
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs.join(",")]);

  const visible = activeSlug
    ? products.filter((p) => p.categories?.slug === activeSlug)
    : products;

  const availableSlugs = Array.from(
    new Map(products.map((p) => [p.categories?.slug, p.categories?.name])).entries()
  ).filter(([s]) => Boolean(s)) as [string, string][];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in-up">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              {title}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md">{subtitle}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card">
            <img
              src={heroImage}
              alt={title}
              width={1024}
              height={1024}
              className="w-full h-56 md:h-72 object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          {showFilters && availableSlugs.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveSlug(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !activeSlug
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
              >
                Todos
              </button>
              {availableSlugs.map(([slug, name]) => (
                <button
                  key={slug}
                  onClick={() => setActiveSlug(slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeSlug === slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visible.map((product, i) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
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

          {!visible.length && (
            <p className="text-muted-foreground">No hay productos disponibles por el momento.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryCatalog;
