import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from '../entity/character.entity';
import { ComicEntity } from '../entity/comic.entity';
import { Character, CharacterSchema } from '../schemas/character.schema';
import { Comic, ComicSchema } from '../schemas/comic.schema';
import { MarvelService } from '../services/marvel.service';
import { ComicsMySqlService } from './comics-mysql.service';
import { ComicsNosqlService } from './comics-nosql.service';
import { ComicsController } from './comics.controller';

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
  controllers: [ComicsController],
  providers: [MarvelService, ComicsMySqlService, ComicsNosqlService],
})
export class ComicsModule {}
