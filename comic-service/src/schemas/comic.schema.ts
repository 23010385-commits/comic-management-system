import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComicDocument = HydratedDocument<Comic>;

@Schema({
  timestamps: true,
})
export class Comic {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  coverImage: string;

  @Prop({ default: 'ONGOING' })
  status: string;

  @Prop({ default: 0 })
  viewCount: number;
}

export const ComicSchema = SchemaFactory.createForClass(Comic);