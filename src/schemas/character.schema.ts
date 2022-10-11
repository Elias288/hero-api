import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CharacterDocument = Character & Document;

@Schema({ versionKey: false })
export class Character {
  @Prop()
  heroId: number;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
