import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Product } from 'src/models/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
