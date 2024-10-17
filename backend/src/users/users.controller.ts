import { Controller, Get, HttpCode } from '@nestjs/common';
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
}
