import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MarvelService } from '../services/marvel.service';

@Controller('characters')
export class CharactersController {
  constructor(private readonly marvelService: MarvelService) {}

  @Get(':offset/:limit')
  getAllCharacters(
    @Param('offset', ParseIntPipe) offset: number,
    @Param('limit', ParseIntPipe) limit: number,
  ) {
    return this.marvelService.getAllCharacters(offset, limit);
  }
}
