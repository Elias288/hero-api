import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { lastValueFrom, map } from 'rxjs';

import { CreateCharactersDto } from '../dto/create.characters.dto';

@Injectable()
export class MarvelService {
  private;
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /* getCharactersWithFetch(page: number): object {
    const offset = page * 20;
    const md5 = createHash('md5')
      .update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/characters?apikey=${process.env.PUBLIC_KEY}&ts=${process.env.TS}&hash=${md5}&offset=${offset}`;

    return fetch(uri)
      .then((res) => res.json())
      .then((characters) => {
        const DtoList = [];
        characters.data.results.forEach((characterInfo: any) => {
          const characterDto = new CreateCharactersDto();
          characterDto.id = characterInfo.id;
          characterDto.name = characterInfo.name;
          characterDto.description = characterInfo.description;
          characterDto.image =
            characterInfo.thumbnail.path +
            '.' +
            characterInfo.thumbnail.extension;
          DtoList.push(characterDto);
        });

        return {
          page: offset,
          characters: DtoList,
        };
      });
  }

  getCharacterByIdWithFetch(id: number): object {
    const md5 = createHash('md5')
      .update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=${process.env.PUBLIC_KEY}&ts=${process.env.TS}&hash=${md5}`;

    return fetch(uri)
      .then((res) => res.json())
      .then((character: any) => {
        const dtoList = [];
        character.data.results.forEach((character2) => {
          const characterDto = new CreateCharactersDto();
          characterDto.name = character2.id;
          characterDto.name = character2.name;
          characterDto.description = character2.description;
          characterDto.image =
            character2.thumbnail.path + '.' + character2.thumbnail.extension;
          dtoList.push(characterDto);
        });
        return dtoList;
      });
  } */

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
            const characterDto = new CreateCharactersDto();
            characterDto.id = character2.id;
            characterDto.name = character2.name;
            characterDto.description = character2.description;
            characterDto.image =
              character2.thumbnail.path + '.' + character2.thumbnail.extension;
            dtoList.push(characterDto);
          });
          return dtoList;
        }),
      ),
    );
  }
}
