export interface Product {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  price: number;
  discount: number;
  features?: ProductFeature[];
}

interface ProductFeature {
  id: number;
  name: string;
}
