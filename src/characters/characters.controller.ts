import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  // Put,
} from '@nestjs/common';
import { HeroeMySQLService } from '../characters/heroe-mysql.service';
import { CharacterEntity } from '../entity/character.entity';
import { Character } from '../schemas/character.schema';
import { HeroeNoSQLService } from './heroe-nosql.service';
import { MarvelService } from '../services/marvel.service';

@Controller('characters')
export class CharactersController {
  constructor(
    private readonly marvelService: MarvelService,
    private readonly heroeNoSQLService: HeroeNoSQLService,
    private readonly heroeMySQLService: HeroeMySQLService,
  ) {}

  /**
   * NO SQL
   * */
  @Get('/nosql')
  getAllCharactersFromMongo() {
    return this.heroeNoSQLService.getAllCharacters();
  }

  @Get('/nosql/:id')
  getCharacterByIdFromMongo(@Param('id', ParseIntPipe) id: number) {
    // console.log('getCharacterByIdFromMongo');

    return this.heroeNoSQLService.getCharacterbyId(id);
  }

  @Post('nosql/:id')
  async saveHeroeNoSQL(@Param('id') id: string) {
    const heroeDto = await this.marvelService.getCharacterById(id);
    heroeDto.comics = await this.heroeNoSQLService.saveComicIdsByCharacterId(
      heroeDto.heroId,
    );

    const heroe = this.CharacterDtoToCharacterSchema(heroeDto);

    return this.heroeNoSQLService.save(heroe);
  }

  @Delete('nosql/:id')
  deleteHeroeNoSQL(@Param('id') id: string) {
    // buscar el heroe indicado en mi base de datos para poderlo borrar
    return this.heroeNoSQLService.delete(id);
  }

  // @Put('nosql/:idHeroeExistente/:idNuevoHeroe')
  // updatedHeroeNoSQL(
  //   @Param('idHeroeExistente') idHeroeExistente: string,
  //   @Param('idNuevoHeroe') idNuevoHeroe: string,
  // ) {
  //   const newHeroe = this.marvelService.getCharacterById(idNuevoHeroe);
  //   // transformar el nuevo heroe para reemplazar los datos del heroe señalado
  //   this.heroeNoSQLService.update();
  // }

  /**
   * MySQL
   * */

  @Get('/sql/:id')
  getCharacterByIdFromMySQL(@Param('id', ParseIntPipe) id: number) {
    // console.log('getCharacterByIdFromMySQL');
    return this.heroeMySQLService.getCharacterById(id);
  }

  @Get('/sql')
  getCharactersOfMysql() {
    // console.log('getCharactersOfMysql');
    return this.heroeMySQLService.getCharacters();
  }

  @Post('sql/:id')
  async saveHeroeMySQL(@Param('id') id: string) {
    const heroe = this.characterDtoToCharacterEntity(
      await this.marvelService.getCharacterById(id),
    );

    const comicsdtos = await this.marvelService.getComicByCharacterId(
      heroe.heroId,
    );

    const comicsEntities = comicsdtos.map((comic) =>
      this.marvelService.comicToComicEntity(comic),
    );

    heroe.comics = comicsEntities;

    return this.heroeMySQLService.save(heroe);
  }

  @Delete('sql/:id')
  deleteHeroeMySQL(@Param('id', ParseIntPipe) id: number) {
    return this.heroeMySQLService.delete(id);
  }

  /**
   * MARVEL API
   */

  @Get(':offset/:limit')
  getAllCharacters(
    @Param('offset', ParseIntPipe) offset: number,
    @Param('limit', ParseIntPipe) limit: number,
  ) {
    console.log('getAllCharacters');
    return this.marvelService.getAllCharacters(offset, limit);
  }

  @Get(':id')
  getCharacterById(@Param('id') id: string) {
    // console.log('getCharacterById');
    return this.marvelService.getCharacterById(id);
  }

  CharacterDtoToCharacterSchema(CharacterDto): Character {
    const heroe = new Character();
    heroe.heroId = CharacterDto.heroId;
    heroe.name = CharacterDto.name;
    heroe.description = CharacterDto.description;
    heroe.image = CharacterDto.image;

    heroe.comics = CharacterDto.comics;

    return heroe;
  }

  characterDtoToCharacterEntity(CharacterDto): CharacterEntity {
    const heroe = new CharacterEntity();
    heroe.heroId = CharacterDto.heroId;
    heroe.name = CharacterDto.name;
    heroe.description = CharacterDto.description;
    heroe.image = CharacterDto.image;

    heroe.comics = CharacterDto.comics;

    return heroe;
  }
}
