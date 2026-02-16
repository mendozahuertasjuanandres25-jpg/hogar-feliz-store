import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string | null;
  rating: number | null;
  categoryName?: string;
}

const ProductCard = ({ name, price, originalPrice, imageUrl, rating, categoryName }: ProductCardProps) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="group bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {categoryName && (
          <span className="text-xs text-primary font-medium uppercase tracking-wide">
            {categoryName}
          </span>
        )}
        <h3 className="font-display font-semibold text-foreground mt-1 line-clamp-2 text-sm leading-snug">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
            <span className="text-xs font-medium text-foreground">{rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-xl font-bold text-foreground">
            ${price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* CTA */}
        <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all">
          <ShoppingCart className="w-4 h-4" />
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
