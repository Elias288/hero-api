import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { lastValueFrom, map } from 'rxjs';
import CharacterDto from 'src/dtos/character.dto';
import ComicDto from 'src/dtos/comic.dto';
import { ComicEntity } from 'src/entity/comic.entity';

@Injectable()
export class MarvelService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getAllCharacters(offset: number, limit: number): Promise<CharacterDto[]> {
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
          return res.data.data.results.map((character2) => {
            return this.CharacterToCharacterDto(character2);
          });
        }),
      ),
    );
  }

  getAllComics(offset: number, limit: number): Promise<ComicDto[]> {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const ts = this.config.get<string>('TS');
    const publicKey = this.config.get<string>('PUBLIC_KEY');

    const md5 = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/comics?apikey=${publicKey}&ts=${ts}&hash=${md5}&limit=${limit}&offset=${offset}`;

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

  async getCharacterById(id: string): Promise<CharacterDto> {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const ts = this.config.get<string>('TS');
    const publicKey = this.config.get<string>('PUBLIC_KEY');

    const md5 = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=${publicKey}&ts=${ts}&hash=${md5}`;

    return await lastValueFrom(
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

  async getComicById(id: number): Promise<ComicDto> {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const ts = this.config.get<string>('TS');
    const publicKey = this.config.get<string>('PUBLIC_KEY');

    const md5 = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/comics/${id}?apikey=${publicKey}&ts=${ts}&hash=${md5}`;

    return await lastValueFrom(
      this.httpService.get(uri).pipe(
        map(async (res) => {
          const comicInfo = res.data.data.results[0];
          const comicDto = this.ComicToComicDto(comicInfo);
          return comicDto;
        }),
      ),
    );
  }

  getComicByCharacterId(characterId: number): Promise<ComicDto[]> {
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
