import { Controller, Get } from '@nestjs/common';
import { CharactersService } from './service/characters.service';

@Controller('characters')
export class CharactersController {
    constructor(private readonly CharacterService: CharactersService) {}

    @Get()
    list(): {} {
        return this.CharacterService.getCharacters();
        // return { 'publickey': process.env.PUBLIC_KEY }
    }
}
