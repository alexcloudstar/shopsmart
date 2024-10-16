import { Injectable } from '@nestjs/common';
import { IUser, UserType } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private readonly users: IUser[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.profile_pic = createUserDto.profile_pic;
    user.type = UserType.USER;
    //user.address = createUserDto.address;

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
