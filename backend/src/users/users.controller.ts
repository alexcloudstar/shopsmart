import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/users/user.entity';
import { UserType } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body() createUser: User): Promise<User> {
    const assignUserType = (type: string): UserType => {
      switch (type) {
        case 'admin':
          return UserType.ADMIN;
        case 'vendor':
          return UserType.VENDOR;
        default:
          return UserType.USER;
      }
    };

    const userType = assignUserType(createUser.type);

    return this.usersService.create({
      ...createUser,
      type: userType,
    });
  }
}
