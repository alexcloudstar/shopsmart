import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/users/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':email')
  @HttpCode(200)
  findOne(@Param() params: { email: string }): Promise<User> {
    return this.usersService.findOne(params.email);
  }
}
