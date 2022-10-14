import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ComicDocument = Comic & Document;

@Schema({ versionKey: false })
export class Comic {
  @Prop()
  comicId: number;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  format: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }] })
  characters: number[];
}

export const ComicSchema = SchemaFactory.createForClass(Comic);
