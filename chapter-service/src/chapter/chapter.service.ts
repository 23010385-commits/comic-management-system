import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from '../schemas/chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private chapterModel: Model<ChapterDocument>,
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    const chapter = await this.chapterModel.create(createChapterDto);

    return {
      message: 'Chapter created successfully',
      chapter,
    };
  }

  async findByComic(comicId: string) {
    return this.chapterModel
      .find({ comicId })
      .sort({ chapterNumber: 1 });
  }

  async findOne(id: string) {
    const chapter = await this.chapterModel.findById(id);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }
}