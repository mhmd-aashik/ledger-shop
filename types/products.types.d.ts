export interface Product {
 id: string;
 name: string;
 price: number;
 image: string;
 category: string;
 description: string;
}

export interface ProductItem {
 id: string;
 name: string;
 price: number;
 images: string[];
 video?: string;
 category: string;
 description: string;
 features: string[];
 rating: number;
 reviews: number;
 inStock: boolean;
}