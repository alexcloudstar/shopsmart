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
    @Param() params: { product_id: string },
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<{
    message: string;
  }> {
    return this.productService.addFavorite(params.product_id, jwt_payload);
  }

  @Patch('/rating/:product_id')
  addRating(
    @Param() params: { product_id: string },
    @Body() body: { rating: number },
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<{
    message: string;
  }> {
    return this.productService.addRating(
      params.product_id,
      body.rating,
      jwt_payload,
    );
  }

  @Patch('/cart/:product_id')
  addToCart(
    @Param() params: { product_id: string },
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<{
    message: string;
  }> {
    return this.productService.addToCart(params.product_id, jwt_payload);
  }

  @Patch('/order')
  placeOrder(@JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD): Promise<{
    status: number;
    message: string;
  }> {
    return this.productService.placeOrder(jwt_payload);
  }
}
