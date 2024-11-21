import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Product } from 'src/models/products/product.entity';
import { ProductsService } from './products.service';
import { Order } from 'src/models/orders/order.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order])],
  providers: [ProductsService, UsersService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
