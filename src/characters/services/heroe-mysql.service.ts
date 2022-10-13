import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { lastValueFrom, map } from 'rxjs';
import { CharacterEntity } from 'src/entity/character.entity';
import { ComicEntity } from 'src/entity/comic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeroeMySQLService {
  constructor(
    @InjectRepository(CharacterEntity)
    private characterRepository: Repository<CharacterEntity>,
    @InjectRepository(ComicEntity)
    private comicRepository: Repository<ComicEntity>,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
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
    // const question = this.characterRepository.getRepository();
    return await this.characterRepository.delete(character);
  }

  //   update() {
  //     throw new Error('no implementado');
  //   }
}
