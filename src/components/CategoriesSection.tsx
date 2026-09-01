import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Gamepad2, Refrigerator, Sofa, Smartphone, Tablet, Tv } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "toy-brick": <Gamepad2 className="w-7 h-7" />,
  "refrigerator": <Refrigerator className="w-7 h-7" />,
  "sofa": <Sofa className="w-7 h-7" />,
  "smartphone": <Smartphone className="w-7 h-7" />,
  "tablet": <Tablet className="w-7 h-7" />,
  "tv": <Tv className="w-7 h-7" />,
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Explorá por categoría
          </h2>
          <p className="text-muted-foreground">
            Encontrá lo que buscás de forma rápida y sencilla
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/?categoria=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : <Gamepad2 className="w-7 h-7" />}
              </div>
              <span className="text-sm font-semibold text-foreground">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
