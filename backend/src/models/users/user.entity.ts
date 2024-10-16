import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from 'src/users/interfaces/user.interface';
import { IsEmail } from 'class-validator';

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
}
