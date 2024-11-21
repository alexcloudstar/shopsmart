import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IJWT_PAYLOAD } from 'src/common/types';
import { Order } from 'src/models/orders/order.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  async findAll(): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.find();
      return orders;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: {
          id,
        },
      });

      if (!order) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Order not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return order;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async create(jwt_payload: IJWT_PAYLOAD): Promise<Order> {
    try {
      const user = await this.userService.findOne(jwt_payload.sub);

      const products = await this.productService.findAll();
      const filtered = products.filter((product) => {
        return user.cart.includes(product.id.toString());
      });

      const total: number = filtered.reduce(
        (acc, product) => acc + product.price,
        0,
      );

      // TODO: find products prices from the user.cart

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.cart || user.cart.length === 0) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Cart is empty',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const order = await this.orderRepository.save({
        user_id: user.id,
        products: user.cart,
        total,
      });

      user.cart = [];

      await this.userService.update_profile(user, jwt_payload);

      return order;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
