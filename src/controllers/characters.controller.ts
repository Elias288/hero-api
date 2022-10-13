import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  // Put,
} from '@nestjs/common';
import { HeroeMySQLService } from 'src/characters/services/heroe-mysql.service';
import { CharacterEntity } from 'src/entity/character.entity';
import { Character } from 'src/schemas/character.schema';
import { HeroeNoSQLService } from '../characters/services/heroe-nosql.service';
import { MarvelService } from '../characters/services/marvel.service';

@Controller('characters')
export class CharactersController {
  constructor(
    private readonly marvelService: MarvelService,
    private readonly heroeNoSQLService: HeroeNoSQLService,
    private readonly heroeMySQLService: HeroeMySQLService,
  ) {}

  @Get('/nosql/:id')
  getCharacterByIdFromMongo(@Param('id', ParseIntPipe) id: number) {
    return this.heroeNoSQLService.getCharacterbyId(id);
  }

  @Get('/sql/:id')
  getCharacterByIdFromMySQL(@Param('id', ParseIntPipe) id: number) {
    return this.heroeMySQLService.getCharacterById(id);
  }

  @Get('/sql')
  getCharactersOfMysql() {
    return this.heroeMySQLService.getCharacters();
  }

  @Get(':offset/:limit')
  getAllCharacters(
    @Param('offset', ParseIntPipe) offset: number,
    @Param('limit', ParseIntPipe) limit: number,
  ) {
    return this.marvelService.getAllCharacters(offset, limit);
  }

  @Get(':id')
  getCharacterById(@Param('id') id: string) {
    return this.marvelService.getCharacterById(id);
  }

  @Post('nosql/:id')
  async saveHeroeNoSQL(@Param('id') id: string) {
    const heroeDto = await this.marvelService.getCharacterById(id);
    heroeDto.comics = await this.heroeNoSQLService.saveComicIdsByCharacterId(
      heroeDto.heroId,
    );

    const heroe = this.CharacterDtoToCharacter(heroeDto);

    return this.heroeNoSQLService.save(heroe);
  }

  @Post('sql/:id')
  async saveHeroeMySQL(@Param('id') id: string) {
    const heroe = this.CharacterDtoToCharacterEntity(
      await this.marvelService.getCharacterById(id),
    );

    const comicsdtos = await this.marvelService.getComicIdsByCharacterId(
      heroe.heroId,
    );

    const comicsEntities = comicsdtos.map((comic) =>
      this.marvelService.comicToComicEntity(comic),
    );

    heroe.comics = comicsEntities;

    return this.heroeMySQLService.save(heroe);
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

  @Delete('sql/:id')
  deleteHeroeMySQL(@Param('id', ParseIntPipe) id: number) {
    return this.heroeMySQLService.delete(id);
  }

  @Delete('nosql/:id')
  deleteHeroeNoSQL(@Param('id') id: string) {
    // buscar el heroe indicado en mi base de datos para poderlo borrar
    return this.heroeNoSQLService.delete(id);
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

  CharacterDtoToCharacterEntity(CharacterDto): CharacterEntity {
    const heroe = new CharacterEntity();
    heroe.heroId = CharacterDto.heroId;
    heroe.name = CharacterDto.name;
    heroe.description = CharacterDto.description;
    heroe.image = CharacterDto.image;

    heroe.comics = CharacterDto.comics;

    return heroe;
  }
}
