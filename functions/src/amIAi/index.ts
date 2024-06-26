import { NestFactory } from '@nestjs/core';
import { AmIAiModule } from 'src/amIAi/app/amIAi.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { MikroORM } from '@mikro-orm/core';
import { AppConfigService } from 'src/amIAi/config/config.service';

export const server = express();

export const ready = async () => {
  const app = await NestFactory.create(AmIAiModule, new ExpressAdapter(server));

  const configService = app.get(AppConfigService);

  const allowOrigins = configService.get('ALLOW_ORIGINS').split(' ');

  app.use(helmet());
  app.enableCors({ origin: allowOrigins });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getSchemaGenerator().updateSchema();
  await app.init();
};

export const bootStrap = async () => {
  const app = await NestFactory.create(AmIAiModule);

  const configService = app.get(AppConfigService);

  const allowOrigins = configService.get('ALLOW_ORIGINS').split(' ');

  app.use(helmet());
  app.enableCors({ origin: allowOrigins });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getSchemaGenerator().updateSchema();
  await app.listen(3000);
};
