import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
