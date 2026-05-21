import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { Chapter, ChapterSchema } from '../schemas/chapter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Chapter.name, schema: ChapterSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
