import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ComicEntity } from './comic.entity';

@Entity({ name: 'character' })
export class CharacterEntity {
  @PrimaryGeneratedColumn()
  heroId: number;
  @Column()
  name: string;
  @Column({ type: 'varchar', length: 500 })
  description: string;
  @Column()
  image: string;

  @ManyToMany(() => ComicEntity, (comic) => comic.characters, {
    cascade: true,
  })
  @JoinTable()
  comics: ComicEntity[];
}
