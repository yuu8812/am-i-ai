import { NestFactory } from '@nestjs/core';
import { AmIAiModule } from 'src/amIAi/app/amIAi.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

export const server = express();

export const ready = (async () => {
  const app = await NestFactory.create(AmIAiModule, new ExpressAdapter(server));
  await app.init();

  app.use(helmet());
  // cors setting
  app.enableCors({ origin: process.env.ALLOW_ORIGINS.split(' ') });
  // use validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
})();
