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
import { IRequestWithUser } from 'src/common/types';

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
    @Req() req: IRequestWithUser,
  ): Promise<Product> {
    return this.productService.create(createProductDto, req.user.sub);
  }

  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() createProductDto: TProductDto,
    @Req() req: IRequestWithUser,
  ): Promise<Product> {
    return this.productService.update(id, createProductDto, req.user.sub);
  }

  // get all products of vendor (user don't have to be vendor)
  // add favorite
  // add rating
  // add to cart
  // add to wishlist
}
