import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/models/users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'float',
  })
  total: number;
  @Column({
    type: 'float',
    default: 0,
  })
  discount: number;
  @Column({
    type: 'varchar',
  })
  @ManyToOne(() => User, (user) => user.id)
  @Column({
    type: 'varchar',
  })
  user_id: string;
  @Column({
    type: 'varchar',
    array: true,
  })
  @OneToMany(() => Product, (product) => product.id)
  @Column({
    type: 'varchar',
    array: true,
  })
  products: string[];
}
