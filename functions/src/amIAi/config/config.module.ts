import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from 'src/amIAi/config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        if (process.env.NODE_ENV === 'NEST_SELF_HOSTED') {
          return '.env.dev';
        }
        return '.env';
      })(),
      isGlobal: true,
      validate: (config: Environment) => {
        const { ENV, NODE_ENV } = config;
        if (!ENV) {
          throw new Error('ENV is required');
        }
        Logger.log(`ENVIRONMENT: ${ENV.toUpperCase()}`);
        Logger.log(`NODE_ENV: ${NODE_ENV.toUpperCase()}`);
        return config;
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
