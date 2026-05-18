import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/comic_comic_db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}