import { Controller, Post, Get, Param, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('chapters/:chapterId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Param('chapterId') chapterId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const token = authHeader.split(' ')[1];
      const payloadBase64 = token.split('.')[1];
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const user = JSON.parse(payloadJson);

      return this.commentService.create(chapterId, createCommentDto, user);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  findAll(@Param('chapterId') chapterId: string) {
    return this.commentService.findAllByChapter(chapterId);
  }
}
