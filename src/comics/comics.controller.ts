import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Comic } from 'src/schemas/comic.schema';
import { MarvelService } from '../services/marvel.service';
import { ComicsMySqlService } from './comics-mysql.service';
import { ComicsNosqlService } from './comics-nosql.service';

@Controller('comics')
export class ComicsController {
  constructor(
    private readonly marvelService: MarvelService,
    private readonly comicNoSqlService: ComicsNosqlService,
    private readonly comicMySqlService: ComicsMySqlService,
  ) {}

  /**
   * NOSQL
   */

  @Get('/nosql')
  getAllComicsOfMongo() {
    // console.log('getAllComicsOfMongo');
    return this.comicNoSqlService.getAllComics();
  }

  @Get('/nosql/:id')
  getComicsByIdOfMongo(@Param('id', ParseIntPipe) id: number) {
    // console.log('getComicsByIdOfMongo');
    return this.comicNoSqlService.getComicById(id);
  }

  @Post('nosql/:id')
  async saveComicNoSqlIdsByCharacterId(@Param('id', ParseIntPipe) id: number) {
    const comicDto = await this.marvelService.getComicById(id);

    return this.comicNoSqlService.save(this.comicDtoToComicSchema(comicDto));
  }

  @Delete('nosql/:id')
  deleteComicNoSqlById(@Param('id') id: string) {
    return this.comicNoSqlService.delete(id);
  }

  @Post('sql/:id')
  saveComicSqlIdsByCharacterId(@Param('id') id: string) {
    throw new Error('Not implemented');
  }

  @Delete('sql/:id')
  deleteComicSqlById(@Param('id') id: string) {
    throw new Error('Not implemented');
  }

  /**
   * MARVEL API
   */

  @Get(':offset/:limit')
  getAllComics(
    @Param('offset', ParseIntPipe) offset: number,
    @Param('limit', ParseIntPipe) limit: number,
  ) {
    return this.marvelService.getAllComics(offset, limit);
  }

  @Get()
  getComicById() {
    throw new Error('Not implemented');
  }

  @Get()
  getCharactersOfComicById() {
    throw new Error('Not implemented');
  }

  comicDtoToComicSchema(comicDto): Comic {
    const comic = new Comic();
    comic.comicId = comicDto.comicId;
    comic.title = comicDto.title;
    comic.description = comicDto.description;
    comic.format = comicDto.format;

    return comic;
  }
}
