import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  // Put,
} from '@nestjs/common';
import { HeroeNoSQLService } from '../characters/services/heroe-nosql.service';
import { MarvelService } from '../characters/services/marvel.service';

@Controller('characters')
export class CharactersController {
  constructor(
    private readonly marvelService: MarvelService,
    private readonly heroeNoSQLService: HeroeNoSQLService,
  ) {}

  @Get('/nosql/:id')
  getCharacterByIdFromMongo(@Param('id', ParseIntPipe) id: number) {
    return this.heroeNoSQLService.getCharacterbyId(id);
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
    const heroe = this.heroeNoSQLService.CharacterDtoToCharacter(heroeDto);

    return this.heroeNoSQLService.save(heroe);
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

  @Delete('nosql/:id')
  deleteHeroeNoSQL(@Param('id') id: string) {
    // buscar el heroe indicado en mi base de datos para poderlo borrar
    this.heroeNoSQLService.delete(id);
  }
}
