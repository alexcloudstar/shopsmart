import { UserType } from '../interfaces/user.interface';

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile_pic: string;
  type: UserType;
  address: any;
}
