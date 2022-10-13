import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import CharacterDto from 'src/dtos/character.dto';
import ComicDto from 'src/dtos/comic.dto';
import { ComicEntity } from 'src/entity/comic.entity';
import { Comic, ComicDocument } from 'src/schemas/comic.schema';

import { Character } from '../../schemas/character.schema';

@Injectable()
export class MarvelService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Comic.name)
    private readonly comicModel: Model<ComicDocument>,
  ) {}

  getAllCharacters(offset: number, limit: number): any {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const ts = this.config.get<string>('TS');
    const publicKey = this.config.get<string>('PUBLIC_KEY');

    const md5 = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&ts=${ts}&hash=${md5}&limit=${limit}&offset=${offset}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map((res) => {
          const dtoList = [];
          res.data.data.results.forEach((character2) => {
            const characterDto = new Character();
            characterDto.heroId = character2.id;
            characterDto.name = character2.name;
            characterDto.description = character2.description;
            characterDto.image = `${character2.thumbnail.path}.${character2.thumbnail.extension}`;
            dtoList.push(characterDto);
          });
          return dtoList;
        }),
      ),
    );
  }

  getCharacterById(id: string): Promise<Promise<CharacterDto>> {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const ts = this.config.get<string>('TS');
    const publicKey = this.config.get<string>('PUBLIC_KEY');

    const md5 = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=${publicKey}&ts=${ts}&hash=${md5}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map(async (res) => {
          const characterInfo = res.data.data.results[0];
          const characterDto = this.CharacterToCharacterDto(characterInfo);
          // console.log(characterDto);

          return characterDto;
        }),
      ),
    );
  }

  getComicIdsByCharacterId(characterId: number): Promise<ComicDto[]> {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const ts = this.config.get<string>('TS');
    const publicKey = this.config.get<string>('PUBLIC_KEY');

    const md5 = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&ts=${ts}&hash=${md5}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map((res) => {
          return res.data.data.results.map((comic) => {
            return this.ComicToComicDto(comic);
          });
        }),
      ),
    );
  }

  CharacterToCharacterDto(character): CharacterDto {
    const characterDto = new CharacterDto();
    characterDto.heroId = character.id;
    characterDto.name = character.name;
    characterDto.description = character.description;
    characterDto.image = `${character.thumbnail.path}.${character.thumbnail.extension}`;

    return characterDto;
  }

  ComicToComicDto(comic): ComicDto {
    const comicDto = new ComicDto();
    comicDto.comicId = comic.id;
    comicDto.description = comic.description;
    comicDto.title = comic.title;
    comicDto.format = comic.format;

    if (comicDto.description && comicDto.description.length > 0) {
      comicDto.description = comicDto.description.substring(0, 250);
    }

    return comicDto;
  }

  comicToComicEntity(comic): ComicEntity {
    const comicEntity = new ComicEntity();
    comicEntity.comicId = comic.comicId;
    comicEntity.title = comic.title;
    comicEntity.format = comic.format;
    comicEntity.description = comic.description;

    return comicEntity;
  }
}
