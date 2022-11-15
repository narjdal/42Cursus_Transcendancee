import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path/posix';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app: NestExpressApplication  = await NestFactory.create(AppModule);
  // app.use('/img', express.static(join(__dirname, 'path/.../photos')));
  const config: ConfigService = app.get(ConfigService);
  // const port: number = config.get<number>('PORT');
  app.enableCors();
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(9000);
}
bootstrap();
