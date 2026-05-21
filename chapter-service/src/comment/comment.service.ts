import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { Chapter, ChapterDocument } from '../schemas/chapter.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
  ) {}

  async create(chapterId: string, createCommentDto: CreateCommentDto, user: any) {
    // Verify that the chapter exists
    const chapter = await this.chapterModel.findById(chapterId);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const newComment = await this.commentModel.create({
      chapterId: new Types.ObjectId(chapterId),
      userId: user.sub,
      username: user.username || 'Anonymous',
      email: user.email,
      content: createCommentDto.content,
    });

    return newComment;
  }

  async findAllByChapter(chapterId: string) {
    return this.commentModel.find({ chapterId: new Types.ObjectId(chapterId) }).sort({ createdAt: -1 });
  }
}
