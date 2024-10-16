import { Address } from 'src/models/addresses/addresses.entity';

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  email: string;
  password: string;
  type: UserType;
  address: Address[];
}

export enum UserType {
  ADMIN = 'admin',
  VENDOR = 'VENDOR',
  USER = 'USER',
}
