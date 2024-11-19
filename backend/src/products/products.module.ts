import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Product } from 'src/models/products/product.entity';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [ProductsService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
