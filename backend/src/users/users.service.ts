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

  async create(createUserDto: User): Promise<User> {
    try {
      return this.userRepository.save(createUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
