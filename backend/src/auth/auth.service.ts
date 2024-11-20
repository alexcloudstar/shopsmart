import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    inputPw: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) throw new Error('User not found');

      const isPasswordValid = await argon2.verify(user.password, inputPw);

      if (!isPasswordValid) throw new UnauthorizedException();

      const payload = { email: user.email, sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: error.message,
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }

  async register(createUserDto: User): Promise<{ access_token: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (user) {
        throw new Error('User already exists');
      }

      const hashedPw = await argon2.hash(createUserDto.password);

      createUserDto.password = hashedPw;

      const savedUser = await this.userRepository.save(createUserDto);

      const payload = { email: savedUser.email, sub: savedUser.id };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: error.message,
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }
}
