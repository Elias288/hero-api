import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Comic, ComicSchema } from 'src/schemas/comic.schema';
import { CharactersController } from '../controllers/characters.controller';
import { Character, CharacterSchema } from '../schemas/character.nosql.schema';
import { HeroeNoSQLService } from './services/heroe-nosql.service';
import { MarvelService } from './services/marvel.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
      { name: Comic.name, schema: ComicSchema },
    ]),
  ],
  controllers: [CharactersController],
  providers: [MarvelService, HeroeNoSQLService],
})
export class CharacterModule {}
