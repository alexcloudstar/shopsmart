import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { User } from 'src/models/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
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
        throw new Error('User already exists');
      }

      const hashedPw = await argon2.hash(createUserDto.password);

      createUserDto.password = hashedPw;

      return this.userRepository.save(createUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();

      const mappedUsers = users.map((user) => ({
        ...user,
        password: undefined,
      }));

      return mappedUsers;
    } catch (error) {
      throw new Error(error);
    }
  }
}
