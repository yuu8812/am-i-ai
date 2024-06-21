import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService extends ConfigService {
  constructor() {
    super();
  }
  get(propertyPath: keyof Environment) {
    return super.get(propertyPath);
  }
}
