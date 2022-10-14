import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model, ObjectId } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import ComicDto from 'src/dtos/comic.dto';
import { Character, CharacterDocument } from 'src/schemas/character.schema';
import { Comic, ComicDocument } from 'src/schemas/comic.schema';

@Injectable()
export class ComicsNosqlService {
  constructor(
    @InjectModel(Comic.name)
    private comicModel: Model<ComicDocument>,
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getAllComics() {
    return this.comicModel.find().exec();
  }

  async getComicById(id: number) {
    const comic = await this.comicModel.findOne({ comicId: id });

    if (!comic) {
      throw new BadRequestException('El comic no existe');
    }

    return comic;
  }

  async save(comic: Comic) {
    const isComic = await this.comicModel.findOne({
      comicId: comic.comicId,
    });
    if (isComic) {
      throw new BadRequestException('El comic ya existe');
    }

    const newComic = await this.comicModel.create(comic);
    return newComic.save();
  }

  async delete(comicId: string) {
    const comic = await this.comicModel.findOne({ comicId });
    if (!comic) {
      throw new BadRequestException('El comic no existe');
    }

    return comic.delete();
  }

  async saveComicIdsByCharacterId(characterId: number): Promise<ObjectId[]> {
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const ts = this.config.get<string>('TS');
    const publicKey = this.config.get<string>('PUBLIC_KEY');

    const md5 = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&ts=${ts}&hash=${md5}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map(async (res) => {
          const t = res.data.data.results.map(async (comic) => {
            const newComicDto = this.ComicToComicDto(comic);
            // console.log(newComicDto);

            const comic2 = await this.comicModel.findOne({
              comicId: newComicDto.comicId,
            });
            if (comic2) {
              return comic2;
            }

            const newComic = await this.comicModel.create(newComicDto);
            return newComic.save();
          });

          const t2 = await Promise.all(t);
          return t2.map((comic) => {
            return comic._id;
          });
        }),
      ),
    );
  }

  ComicToComicDto(comic): ComicDto {
    const comicDto = new ComicDto();
    comicDto.comicId = comic.id;
    comicDto.description = comic.description;
    comicDto.title = comic.title;
    comicDto.format = comic.format;

    return comicDto;
  }
}
