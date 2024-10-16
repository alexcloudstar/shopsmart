import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'varchar',
  })
  street: string;
  @Column({
    type: 'varchar',
  })
  city: string;
  @Column({
    type: 'varchar',
  })
  state: string;
  @Column({
    type: 'varchar',
  })
  zip: string;
  @Column({
    type: 'varchar',
  })
  country: string;
  @Column({
    type: 'varchar',
  })
  user_id: string;
}
