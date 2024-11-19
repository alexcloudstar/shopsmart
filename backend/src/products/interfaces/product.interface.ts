export type TProduct = {
  id: string;
  title: string;
  description: string;
  pictures: string[];
  price: number;
  is_favorite: boolean;
  vendor: string;
  category: string;
  sub_category: string;
  brand: string;
  color: string;
  size: string;
  stock: number;
  rating?: number;
  discount?: number;
};
