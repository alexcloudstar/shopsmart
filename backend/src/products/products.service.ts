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
import { on } from 'events';
import { IJWT_PAYLOAD, IRequestWithUser } from 'src/common/types';
import { JWTPayloadDecorator } from 'src/common/decorators/jwt_payload.decorator';

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
  ): Promise<string> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });
      const user = await this.userService.findOne(jwt_payload.sub);
      const userFavorites = user.favorites;

      if (userFavorites.includes(product.id)) {
        userFavorites.splice(userFavorites.indexOf(product.id), 1);
      }

      userFavorites.push(product.id);

      await this.userService.update(
        user.id,
        {
          favorites: userFavorites,
        },
        jwt_payload,
      );

      return 'Product added to favorites';
    } catch (error) {
      console.log(error);
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
    user_id: string,
    rating: number,
  ): Promise<string> {
    console.log({
      product_id,
      user_id,
      rating,
    });

    return '';
  }
}
