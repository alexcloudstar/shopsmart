import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/users/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':email')
  @HttpCode(HttpStatus.OK)
  findOne(@Param() params: { email: string }): Promise<User> {
    return this.usersService.findOne(params.email);
  }
}
