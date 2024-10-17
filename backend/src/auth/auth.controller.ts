import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from 'src/models/users/user.entity';
import { UserType } from 'src/users/interfaces/user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() signInDto: Record<string, any>,
  ): Promise<{ access_token: string }> {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
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
