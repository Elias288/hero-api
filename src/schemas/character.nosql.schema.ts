import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comic' }] })
  comics: number[];
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
