import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from 'src/models/orders/order.entity';
import { IJWT_PAYLOAD } from 'src/common/types';
import { JWTPayloadDecorator } from 'src/common/decorators/jwt_payload.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param() params: { id: string }): Promise<Order> {
    return this.orderService.findOne(params.id);
  }

  @Post()
  create(@JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD): Promise<Order> {
    return this.orderService.create(jwt_payload);
  }

  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() createOrderDto: any,
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<Order> {
    return this.orderService.update(id, createOrderDto, jwt_payload);
  }
}
