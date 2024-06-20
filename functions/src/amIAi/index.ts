import { NestFactory } from '@nestjs/core';
import { AmIAiModule } from 'src/amIAi/app/amIAi.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { MikroORM } from '@mikro-orm/core';

export const server = express();

export const ready = (async () => {
  const app = await NestFactory.create(AmIAiModule, new ExpressAdapter(server));
  app.use(helmet());
  // cors setting
  app.enableCors({ origin: process.env.ALLOW_ORIGINS.split(' ') });
  // use validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getSchemaGenerator().updateSchema();

  await app.init();
})();
