import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comic, ComicDocument } from 'src/schemas/comic.schema';
import { Character, CharacterDocument } from '../schemas/character.schema';

@Injectable()
export class HeroeNoSQLService {
  constructor(
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Comic.name)
    private readonly comicModel: Model<ComicDocument>,
  ) {}

  getAllCharacters() {
    return this.characterModel.find().exec();
  }

  async getCharacterbyId(id: number) {
    const character = await this.characterModel
      .findOne({ heroId: id })
      .populate('comics');

    if (!character) {
      throw new BadRequestException('El usuario no existe');
    }

    return character;
  }

  async save(heroe: Character) {
    const character = await this.characterModel.findOne({
      heroId: heroe.heroId,
    });
    if (character) {
      throw new BadRequestException('El usuario ya existe');
    }

    const newCharacter = await this.characterModel.create(heroe);
    return newCharacter.save();
  }

  update() {
    throw new Error('No está implementado');
  }

  async delete(heroId: string) {
    const character = await this.characterModel.findOne({ heroId });
    if (!character) {
      throw new BadRequestException('El usuario no existe');
    }

    return character.delete();
  }
}
