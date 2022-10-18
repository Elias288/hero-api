import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from 'src/entity/character.entity';
import { ComicEntity } from 'src/entity/comic.entity';
import { Comic, ComicSchema } from 'src/schemas/comic.schema';
import { CharactersController } from './characters.controller';
import { Character, CharacterSchema } from '../schemas/character.schema';
import { HeroeMySQLService } from './heroe-mysql.service';
import { HeroeNoSQLService } from './heroe-nosql.service';
import { MarvelService } from '../services/marvel.service';
import { ComicsNosqlService } from 'src/comics/comics-nosql.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
      { name: Comic.name, schema: ComicSchema },
    ]),
    TypeOrmModule.forFeature([CharacterEntity, ComicEntity]),
  ],
  controllers: [CharactersController],
  providers: [
    MarvelService,
    HeroeNoSQLService,
    HeroeMySQLService,
    ComicsNosqlService,
  ],
})
export class CharacterModule {}
