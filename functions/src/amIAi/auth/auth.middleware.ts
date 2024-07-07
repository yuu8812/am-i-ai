import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { OAuth2Client } from 'google-auth-library';
import { AuthService } from 'src/amIAi/auth/auth.service';
import { AppConfigService } from 'src/amIAi/config/config.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly authService: AuthService,
  ) {
    this.googleClientId = this.appConfigService.get('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(this.googleClientId);
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];

    if (!auth) throw new UnauthorizedException('Unauthorized');

    const items = auth.split(' ');
    const idToken = items[1];

    if (!idToken) throw new UnauthorizedException('Unauthorized');

    const uid = await this.authService.validate(idToken);

    if (!uid) throw new UnauthorizedException('Unauthorized');

    req.headers['x-user-id'] = uid;

    Logger.log(`User ID: ${uid}`);

    next();
  }
}
