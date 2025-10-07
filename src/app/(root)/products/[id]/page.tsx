import ProductDetailServer from "@/components/ProductDetailServer";
import { productItem } from "@/data/products";

export default function ProductDetail() {
  return <ProductDetailServer product={productItem} />;
}
