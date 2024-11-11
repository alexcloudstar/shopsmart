import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IJWT_PAYLOAD } from 'src/common/types';
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async me(req: Request & { user: User }): Promise<User> {
    try {
      if (!req.user) throw new UnauthorizedException();

      const user = await this.userRepository.findOne({
        where: { id: req.user.id },
      });

      return {
        ...user,
        password: undefined,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) throw new Error('User not found');

      const mappedUser = {
        ...user,
        password: undefined,
      };

      return mappedUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  async update(
    id: string,
    fields: Record<string, any>,
    jwt_payload: IJWT_PAYLOAD,
  ): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (!user) throw new Error('User not found');

      if (jwt_payload.sub !== user.id) {
        throw new Error('Unauthorized');
      }

      const updatedUser = await this.userRepository.save({
        ...user,
        ...fields,
      });

      return {
        ...updatedUser,
        password: undefined,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
