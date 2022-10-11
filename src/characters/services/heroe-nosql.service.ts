import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Character, CharacterDocument } from '../../schemas/character.schema';

@Injectable()
export class HeroeNoSQLService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
  ) {}

  getCharacterbyId(id: number): any {
    return this.characterModel.findOne({ heroId: id });
  }

  save(heroe: Character): Promise<Character> {
    const character = this.characterModel.findOne({ heroId: heroe.heroId });

    if (character) {
      throw new BadRequestException('El usuario ya existe');
    }

    const newCharacter = new this.characterModel(heroe);
    return newCharacter.save();
  }

  // update() {
  //   throw new Error('No está implementado');
  // }

  // delete(id: string) {
  //   throw new Error('No está implementado');
  // }
}
