import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './characters/character.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicsController } from './comics/comics.controller';

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

    // Configuración para conexión con PostgreSQL a través de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // entities: [],
        autoLoadEntities: true,
        synchronize: true,
        logging: process.env.ENVI === 'production' ? false : true,
      }),
    }),

    CharacterModule,
  ],
  controllers: [ComicsController],
  providers: [],
})
export class AppModule {}
