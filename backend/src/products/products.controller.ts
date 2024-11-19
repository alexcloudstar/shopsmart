import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductsService } from './products.service';
import { Product } from 'src/models/products/product.entity';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(): string {
    return 'This action returns a product';
  }

  @Post()
  create(): string {
    return 'This action adds a new product';
  }

  @Put('/update/:id')
  update(): string {
    return 'This action updates a product';
  }
}
