import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from 'src/users/interfaces/user.interface';
import { IsEmail } from 'class-validator';
import { Product } from '../products/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'varchar',
  })
  first_name: string;
  @Column({
    type: 'varchar',
  })
  last_name: string;
  @Column({
    type: 'varchar',
  })
  profile_pic: string;
  @Column({
    type: 'varchar',
  })
  @IsEmail()
  email: string;
  @Column({
    type: 'varchar',
  })
  password: string;
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
  })
  type: UserType;
  @OneToMany(() => Product, (product) => product.vendor_id)
  products: string[];
  @ManyToMany(() => Product, (product) => product.is_favorite)
  favorites: string[];
}
