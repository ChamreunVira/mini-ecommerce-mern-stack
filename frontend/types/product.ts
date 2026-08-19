export interface Seller {
  id: string;
  name: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  category: string;
  seller: Seller;
  colors?: string[];
  sizes?: string[];
  description?: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}
