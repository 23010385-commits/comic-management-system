import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comic, ComicDocument } from '../schemas/comic.schema';
import { CreateComicDto } from './dto/create-comic.dto';

@Injectable()
export class ComicService {
  constructor(
    @InjectModel(Comic.name)
    private comicModel: Model<ComicDocument>,
  ) {}

  async create(createComicDto: CreateComicDto) {
    const comic = await this.comicModel.create(createComicDto);

    return {
      message: 'Comic created successfully',
      comic,
    };
  }

  async findAll() {
    return this.comicModel.find().sort({ createdAt: -1 });
  }
}