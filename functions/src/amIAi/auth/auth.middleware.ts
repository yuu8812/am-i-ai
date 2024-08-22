import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { OAuth2Client } from 'google-auth-library';
import { AuthService } from 'src/amIAi/auth/auth.service';
import { AppConfigService } from 'src/amIAi/config/config.service';
import { extractToken } from 'src/amIAi/utils/extractToken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  googleClient: OAuth2Client;
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

    const token = extractToken(auth as string);

    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const user = await this.authService.validateAndReturnUserId(token);

      if (!user) throw new UnauthorizedException('Unauthorized');

      req.headers['x-user-id'] = user.userId;
      req.headers['x-language'] = user.language.toString();

      next();
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
