import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";

// Type for favorite products with category
type FavoriteProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  sku: string | null;
  barcode: string | null;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  images: string[];
  video: string | null;
  thumbnail: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  tags: string[];
  features: string[];
  materials: string[];
  dimensions: string | null;
  weight: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

interface FavoritesTabProps {
  favorites: FavoriteProduct[];
}

export default function FavoritesTab({ favorites }: FavoritesTabProps) {
  return (
    <TabsContent value="favorites">
      <Card>
        <CardHeader>
          <CardTitle>My Favorites</CardTitle>
          <CardDescription>
            {favorites.length} items in your favorites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No favorites yet</p>
              <Link href="/products">
                <Button className="mt-4">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.slice(0, 6).map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={product.images[0] || "/placeholder-product.jpg"}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        LKR {product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {favorites.length > 6 && (
            <div className="text-center mt-4">
              <Link href="/favorites">
                <Button variant="outline">View All Favorites</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
