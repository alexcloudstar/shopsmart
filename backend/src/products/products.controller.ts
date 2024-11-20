import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductsService } from './products.service';
import { Product } from 'src/models/products/product.entity';
import { TProductDto } from './interfaces/product.dto';
import { IJWT_PAYLOAD, IRequestWithUser } from 'src/common/types';
import { JWTPayloadDecorator } from 'src/common/decorators/jwt_payload.decorator';

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

  @Get('/vendor/:id')
  @HttpCode(HttpStatus.OK)
  findVendorProducts(@Param() params: { id: string }): Promise<Product[]> {
    return this.productService.findVendorProducts(params.id);
  }

  @Patch('/favorite/:product_id')
  addFavorite(
    product_id: string,
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<string> {
    return this.productService.addFavorite(product_id, jwt_payload);
  }

  @Patch('/rating/:product_id')
  addRating(
    product_id: string,
    user_id: string,
    @Body() rating: number,
  ): Promise<string> {
    return this.productService.addRating(product_id, user_id, rating);
  }

  // add to cart
  // add to wishlist
}
