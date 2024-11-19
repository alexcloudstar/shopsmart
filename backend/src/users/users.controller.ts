import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/users/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { IJWT_PAYLOAD, IRequestWithUser } from 'src/common/types';
import { JWTPayloadDecorator } from 'src/common/decorators/jwt_payload.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@Req() req: IRequestWithUser): Promise<User> {
    return this.usersService.me(req);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param() params: { id: string }): Promise<User> {
    return this.usersService.findOne(params.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param() params: { id: string },
    @Body() user: User,
    @JWTPayloadDecorator() jwt_payload: IJWT_PAYLOAD,
  ): Promise<User> {
    return this.usersService.update(params.id, user, jwt_payload);
  }
}
