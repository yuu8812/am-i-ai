import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const POSTGRES_PORT = 5432;
const POSTGRES_HOST = '127.0.0.1';
const POSTGRES_USER = 'postgres';
const POSTGRES_PASSWORD = 'postgres';
const POSTGRES_DB = 'default';

export const mikroOrmConfig: MikroOrmModuleOptions = {
  entities: ['./dist/amIAi/entities'],
  entitiesTs: ['./src/amIAi/entities'],

  driver: PostgreSqlDriver,

  clientUrl: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
};
