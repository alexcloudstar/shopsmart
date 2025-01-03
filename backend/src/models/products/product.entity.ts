import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/models/users/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'varchar',
  })
  title: string;
  @Column({
    array: true,
    type: 'varchar',
  })
  pictures: string[];
  @Column({
    type: 'float',
  })
  price: number;
  @Column({
    type: 'varchar',
  })
  @ManyToOne(() => User, (user) => user.products)
  vendor_id: string;
  @Column({
    type: 'varchar',
  })
  description: string;
  @Column({
    type: 'varchar',
  })
  category: string;
  @Column({
    type: 'varchar',
  })
  sub_category: string;
  @Column({
    type: 'varchar',
  })
  brand: string;
  @Column({
    type: 'varchar',
  })
  color: string;
  @Column({
    type: 'varchar',
  })
  size: string;
  @Column({
    type: 'int',
  })
  stock: number;
  @Column({
    type: 'int',
    default: 0,
  })
  rating_count: number;
  @Column({
    type: 'float',
    default: 0,
  })
  rating: number;
  @Column({
    type: 'float',
    nullable: true,
  })
  discount: number;
}
