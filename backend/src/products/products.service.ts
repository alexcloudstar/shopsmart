import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/models/products/product.entity';
import { Repository } from 'typeorm';
import { TProductDto } from './interfaces/product.dto';
import { UsersService } from 'src/users/users.service';
import { IJWT_PAYLOAD } from 'src/common/types';
import { JWTPayloadDecorator } from 'src/common/decorators/jwt_payload.decorator';
import { calculateNewRating } from './utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UsersService,
  ) {}

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productRepository.find();
      return products;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return product;
    } catch (error) {
      throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }

  async create(
    createProductDto: TProductDto,
    user_id: string,
  ): Promise<Product> {
    try {
      const user = await this.userService.findOne(user_id);

      if (!user.type.includes('vendor')) {
        throw new ForbiddenException('Only vendors can create products');
      }

      const product = await this.productRepository.save({
        ...createProductDto,
        vendor_id: user.id.toString(),
      });
      return product;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async update(
    product_id: string,
    updateProductDto: TProductDto,
    user_id: string,
  ): Promise<Product> {
    try {
      const user = await this.userService.findOne(user_id);

      if (!user.type.includes('vendor')) {
        throw new ForbiddenException('Only vendors can update products');
      }

      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (product.vendor_id !== user.id.toString()) {
        throw new ForbiddenException('You can only update your own products');
      }

      const updatedProduct = await this.productRepository.save({
        ...product,
        ...updateProductDto,
      });

      return updatedProduct;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findVendorProducts(vendor_id: string): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        where: { vendor_id },
      });

      return products;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async addFavorite(
    product_id: string,
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<{
    message: string;
  }> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const user = await this.userService.findOne(jwt_payload.sub);
      let message = '';

      if (!user.favorites.includes(product_id)) {
        user.favorites = [...user.favorites, product_id];
        message = 'Product added to favorites';
      } else {
        message = 'Product removed from favorites';
        user.favorites = user.favorites.filter((id) => id !== product_id);
      }

      await this.userService.update_profile(
        {
          favorites: user.favorites,
        },
        jwt_payload,
      );

      return {
        message,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async addRating(
    product_id: string,
    rating: number,
    jwt_payload: IJWT_PAYLOAD,
  ): Promise<{
    message: string;
  }> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (product.vendor_id === jwt_payload.sub.toString()) {
        throw new ForbiddenException('You can not rate your own product');
      }

      const newRating = (product.rating + rating) / 2;
      const updatedRating = calculateNewRating(
        product.rating,
        product.rating_count,
        newRating,
      );

      await this.productRepository.update(
        { id: product_id },
        {
          rating_count: product.rating_count + 1,
          rating: updatedRating,
        },
      );

      return {
        message: 'Rating added',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async addToCart(
    product_id: string,
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<{
    message: string;
  }> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const user = await this.userService.findOne(jwt_payload.sub);
      let message = '';

      if (!user.cart.includes(product_id)) {
        user.cart = [...user.cart, product_id];
        message = 'Product added to cart';
      } else {
        message = 'Product removed from cart';
        user.cart = user.cart.filter((id) => id !== product_id);
      }

      await this.userService.update_profile(
        {
          cart: user.cart,
        },
        jwt_payload,
      );

      return {
        message,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async placeOrder(@JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD): Promise<{
    status: number;
    message: string;
  }> {
    try {
      const user = await this.userService.findOne(jwt_payload.sub);

      const cart = user.cart;

      // You can add more logic here to handle the order

      return {
        status: HttpStatus.OK,
        message: 'Order placed',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
