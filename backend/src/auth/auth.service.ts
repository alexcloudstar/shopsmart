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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(email: string, inputPw: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) throw new Error('User not found');

      const isPasswordValid = await argon2.verify(user.password, inputPw);

      if (!isPasswordValid) throw new UnauthorizedException();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      // TODO: Generate a JWT and return it here
      // instead of the user object
      return result;
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

  async register(createUserDto: User): Promise<User> {
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

      const mappedUser = {
        ...savedUser,
        password: undefined,
      };

      return mappedUser;
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
