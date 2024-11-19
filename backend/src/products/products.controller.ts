import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductsService } from './products.service';
import { Product } from 'src/models/products/product.entity';
import { TProductDto } from './interfaces/product.dto';
import { User } from 'src/models/users/user.entity';

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
  findOne(@Param() params: { id: string }): Promise<Product> {
    return this.productService.findOne(params.id);
  }

  @Post()
  create(
    @Body() createProductDto: TProductDto,
    @Req() req: Request & { user: User },
  ): Promise<Product> {
    return this.productService.create(createProductDto, req.user.id);
  }

  @Put('/update/:id')
  update(): string {
    return 'This action updates a product';
  }
}
