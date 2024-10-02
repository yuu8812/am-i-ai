import { NestFactory } from '@nestjs/core';
import { AmIAiModule } from 'src/amIAi/app/amIAi.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import admin from 'firebase-admin';

import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { MikroORM } from '@mikro-orm/core';
import * as serviceAccount from 'src/amIAi/firebase.json';

import { AppConfigService } from 'src/amIAi/config/config.service';
import { getApps } from 'firebase-admin/app';
import { InitializeUseCase } from 'src/amIAi/usecase/init/initiaize.usecase';

export const server = express();

const init = async () => {
  getApps().length === 0 &&
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

  Logger.log(
    `firebase: ${await (admin as any).app().options.credential
      .projectId} has been initialized`,
  );

  const app = await NestFactory.create(AmIAiModule, new ExpressAdapter(server));
  const configService = app.get(AppConfigService);
  const initialize = app.get(InitializeUseCase);
  const allowOrigins = configService.get('ALLOW_ORIGINS').split(' ');
  app.use(helmet());
  app.enableCors({ origin: allowOrigins });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getSchemaGenerator().updateSchema();
  await initialize.execute();

  return app;
};

export const ready = async () => {
  const app = await init();
  await app.init();
};

export const bootStrap = async () => {
  const app = await init();
  await app.listen('4000', () => Logger.log('Server is running on port 4000'));
};
