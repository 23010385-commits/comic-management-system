import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComicService } from './comic.service';
import { CreateComicDto } from './dto/create-comic.dto';

@Controller('comics')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Post()
  create(@Body() createComicDto: CreateComicDto) {
    return this.comicService.create(createComicDto);
  }

  @Get()
  findAll() {
    return this.comicService.findAll();
  }
}