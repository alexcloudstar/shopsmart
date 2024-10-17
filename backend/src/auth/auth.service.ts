import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(createUserDto: User): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (user) {
        throw new Error();
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
          error: 'User already exists',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }
}
