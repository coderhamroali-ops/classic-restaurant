import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from './dish.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /** Порядок вкладок в меню: меньше — левее. */
  @Column({ default: 0 })
  sortOrder: number;

  @OneToMany(() => Dish, (d) => d.category)
  dishes: Dish[];
}
