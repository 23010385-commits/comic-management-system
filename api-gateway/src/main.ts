import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://localhost:3001/auth',
      changeOrigin: true,
    }),
  );

  app.use(
    '/api/comics',
    createProxyMiddleware({
      target: 'http://localhost:3002/comics',
      changeOrigin: true,
    }),
  );

  app.use(
    '/api/chapters',
    createProxyMiddleware({
      target: 'http://localhost:3003/chapters',
      changeOrigin: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();