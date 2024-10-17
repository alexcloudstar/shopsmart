import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { User } from 'src/models/users/user.entity';
import { UserType } from 'src/users/interfaces/user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() user: User): Promise<Omit<User, 'password'>> {
    return this.authService.login(user.email, user.password);
  }

  @Post('/register')
  @HttpCode(201)
  async create(@Body() createUser: User): Promise<User> {
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

    return this.authService.register({
      ...createUser,
      type: userType,
    });
  }
}
