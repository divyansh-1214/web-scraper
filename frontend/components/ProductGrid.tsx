import ProductCard from './ProductCard';
import type { Product } from '../lib/types';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p, idx) => (
        <ProductCard key={p._id || `${p.sourceProductId}-${idx}`} product={p} index={idx} />
      ))}
    </div>
  );
}
