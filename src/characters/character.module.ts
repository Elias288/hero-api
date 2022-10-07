import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CharactersController } from './controllers/characters.controller';
import { MarvelService } from './services/marvel.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [CharactersController],
  providers: [MarvelService],
})
export class CharacterModule {}
