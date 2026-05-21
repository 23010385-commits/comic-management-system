import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Chapter' })
  chapterId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
