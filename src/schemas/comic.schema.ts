import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const ComicSchema = SchemaFactory.createForClass(Comic);
