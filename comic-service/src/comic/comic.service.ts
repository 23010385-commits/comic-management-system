import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comic, ComicDocument } from '../schemas/comic.schema';
import { CreateComicDto } from './dto/create-comic.dto';
import { UpdateComicDto } from './dto/update-comic.dto';

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

  async findOne(id: string) {
    const comic = await this.comicModel.findById(id);

    if (!comic) {
      throw new NotFoundException('Comic not found');
    }

    return comic;
  }

  async update(id: string, updateComicDto: UpdateComicDto) {
    const comic = await this.comicModel.findByIdAndUpdate(
      id,
      updateComicDto,
      {
        new: true,
      },
    );

    if (!comic) {
      throw new NotFoundException('Comic not found');
    }

    return {
      message: 'Comic updated successfully',
      comic,
    };
  }

  async remove(id: string) {
    const comic = await this.comicModel.findByIdAndDelete(id);

    if (!comic) {
      throw new NotFoundException('Comic not found');
    }

    return {
      message: 'Comic deleted successfully',
    };
  }
}