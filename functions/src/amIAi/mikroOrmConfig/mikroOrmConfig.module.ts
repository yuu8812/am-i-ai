import { Module } from '@nestjs/common';
import { AppConfigService } from 'src/amIAi/config/config.service';
import { MikroOrmConfigService } from './mikroOrmConfig.service'; // MikroOrmConfigService の実装ファイルのパスを正しく指定する必要があります
import { AppConfigModule } from 'src/amIAi/config/config.module';

@Module({
  imports: [AppConfigModule],
  providers: [
    AppConfigService,
    {
      useFactory: (appConfigService: AppConfigService) =>
        new MikroOrmConfigService(appConfigService),
      inject: [AppConfigService],
      provide: MikroOrmConfigService,
    },
  ],
  exports: [MikroOrmConfigService],
})
export class MikroOrmConfigModule {}
