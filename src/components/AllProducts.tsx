import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const slugParam = searchParams.get("categoria");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name, slug");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    if (!slugParam) {
      setActiveCategory(null);
      return;
    }
    const match = categories.find((c) => c.slug === slugParam);
    if (match) {
      setActiveCategory(match.id);
      document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [slugParam, categories]);

  const selectCategory = (id: string | null) => {
    setActiveCategory(id);
    const slug = categories.find((c) => c.id === id)?.slug;
    setSearchParams(slug ? { categoria: slug } : {}, { replace: true });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from("products")
        .select("id, name, price, original_price, image_url, rating, categories(name)");
      if (activeCategory) {
        query = query.eq("category_id", activeCategory);
      }
      const { data } = await query;
      if (data) setProducts(data as unknown as Product[]);
    };
    fetchProducts();
  }, [activeCategory]);


  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-foreground mb-6">
          Todos los productos
        </h2>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !activeCategory
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <ProductCard
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

export default AllProducts;
