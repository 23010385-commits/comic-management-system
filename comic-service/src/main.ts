import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectRabbitMQ } from './rabbitmq/rabbitmq.provider';

async function bootstrap() {
  await connectRabbitMQ();

  const app = await NestFactory.create(AppModule);

  await app.listen(3002);
}
bootstrap();