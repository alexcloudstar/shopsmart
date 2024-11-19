import { TProduct } from './product.interface';

export type TProductDto = Omit<TProduct, 'id' | 'is_favorite' | 'rating'>;
