import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  // Put,
} from '@nestjs/common';
import { HeroeNoSQLService } from '../services/heroe-nosql.service';
import { MarvelService } from '../services/marvel.service';

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
  saveHeroeNoSQL(@Param('id') id: string) {
    const heroe = this.marvelService.getCharacterById(id);

    // transformar heroe en lo que requiero guardar
    return heroe.then((hero) => {
      // console.log(hero);
      this.heroeNoSQLService.save(hero);
      return heroe;
    });
  }

  // @Put('nosql/:idHeroeExistente/:idNuevoHeroe')
  // updatedHeroeNoSQL(
  //   @Param('idHeroeExistente') idHeroeExistente: string,
  //   @Param('idNuevoHeroe') idNuevoHeroe: string,
  // ) {
  //   // const newHeroe = this.marvelHeroeService.getHeroe(idNuevoHeroe);
  //   // transformar el nuevo heroe para reemplazar los datos del heroe señalado
  //   this.heroeNoSQLService.update();
  // }

  // @Put('nosql/:id')
  // deleteHeroeNoSQL(@Param('id') id: string) {
  //   // buscar el heroe indicado en mi base de datos para poderlo borrar
  //   this.heroeNoSQLService.delete(id);
  // }
}
