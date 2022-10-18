import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacterEntity } from '../entity/character.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeroeMySQLService {
  constructor(
    @InjectRepository(CharacterEntity)
    private characterRepository: Repository<CharacterEntity>,
  ) {}

  async getCharacters() {
    const list = await this.characterRepository.find();
    if (!list.length) {
      throw new NotFoundException({ message: 'no se encontraron heroes' });
    }
    return list;
  }

  getCharacterById(id: number) {
    throw new Error('no implementado');
  }

  save(heroe: CharacterEntity) {
    // console.log(heroe);
    return this.characterRepository.manager.save(heroe);
  }

  async delete(id: number) {
    const character = await this.characterRepository.findOne({
      where: { heroId: id },
    });
    return await this.characterRepository.delete(character);
  }

  //   update() {
  //     throw new Error('no implementado');
  //   }
}
