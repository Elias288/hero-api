import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  Character,
  CharacterDocument,
} from '../../schemas/character.nosql.schema';

@Injectable()
export class HeroeNoSQLService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
  ) {}

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
    // console.log(heroe);

    const newCharacter = await this.characterModel.create(heroe);
    // console.log(newCharacter);
    return newCharacter.save();
  }

  update() {
    throw new Error('No está implementado');
  }

  async delete(heroId: string) {
    const character = this.characterModel.findOne({ heroId });
    if (!character) {
      throw new BadRequestException('El usuario no existe');
    }

    return (await character).delete();
  }

  CharacterDtoToCharacter(CharacterDto): Character {
    const heroe = new Character();
    heroe.heroId = CharacterDto.heroId;
    heroe.name = CharacterDto.name;
    heroe.description = CharacterDto.description;
    heroe.image = CharacterDto.image;

    heroe.comics = CharacterDto.comics;

    return heroe;
  }
}
