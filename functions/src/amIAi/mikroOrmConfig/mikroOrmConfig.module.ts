import { Module } from '@nestjs/common';
import { AppConfigService } from 'src/amIAi/config/config.service';
import { MikroOrmConfigService } from 'src/amIAi/mikroOrmConfig/mikroOrmConfig.service';
import { AppConfigModule } from 'src/amIAi/config/config.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    AppConfigModule,
    MikroOrmModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) =>
        new MikroOrmConfigService(appConfigService).getMikroOrmConfig(),
      inject: [AppConfigService],
      imports: [AppConfigModule],
    }),
  ],
})
export class MikroOrmConfigModule {}
