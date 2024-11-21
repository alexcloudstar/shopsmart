import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Order } from 'src/models/orders/order.entity';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/models/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Product])],
  providers: [OrdersService, UsersService, ProductsService],
  controllers: [OrdersController],
})
export class OrdersModule {}
