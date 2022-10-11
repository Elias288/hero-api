import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
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

    // Configuración para conexión con MongoDB a través de Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('NOSQL_URI'),
      }),
    }),

    CharacterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
