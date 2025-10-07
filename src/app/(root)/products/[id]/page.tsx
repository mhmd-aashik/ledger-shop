import ProductDetailServer from "@/components/ProductDetailServer";
import { productItem } from "@/data/products";

export const dynamic = "force-dynamic";

export default function ProductDetail() {
  return <ProductDetailServer product={productItem} />;
}
