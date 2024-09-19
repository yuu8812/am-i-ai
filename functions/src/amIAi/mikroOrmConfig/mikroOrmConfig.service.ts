import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from 'src/amIAi/config/config.service';
import { resolve } from 'path';

@Injectable()
export class MikroOrmConfigService {
  constructor(private readonly appConfigService: AppConfigService) {}

  private defineClientUrl(): string {
    const POSTGRES_DB = this.appConfigService.get('POSTGRES_DB');
    const POSTGRES_USER = this.appConfigService.get('POSTGRES_USER');
    const POSTGRES_PASSWORD = this.appConfigService.get('POSTGRES_PASSWORD');
    const POSTGRES_HOST = this.appConfigService.get('POSTGRES_HOST');
    const POSTGRES_PORT = this.appConfigService.get('POSTGRES_PORT');

    const url = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
    Logger.log(`Client URL: ${url}`);
    return url;
  }

  getMikroOrmConfig(): MikroOrmModuleOptions {
    return {
      entities: [resolve(__dirname, '../entities')],
      entitiesTs: [resolve(__dirname, '../entities')],
      clientUrl: this.defineClientUrl(),
      driver: PostgreSqlDriver,
      autoLoadEntities: true,
      autoJoinOneToOneOwner: true,
    };
  }
}
