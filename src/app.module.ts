import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CharacterModule } from './characters/character.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(
        process.cwd(),
        'environments',
        '.env.' + process.env.ENVI.trim(),
      ),
    }),
    CharacterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
