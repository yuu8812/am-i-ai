import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { OAuth2Client } from 'google-auth-library';
import { AppConfigService } from 'src/amIAi/config/config.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;
  constructor(private readonly appConfigService: AppConfigService) {
    this.googleClientId = this.appConfigService.get('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(this.googleClientId);
  }
  async use(req: Request, res: Response, next: NextFunction) {
    req.headers['x-user-id'] = 'tomato';

    next();
    // const auth = req.headers['authorization'];

    // if (!auth) throw new UnauthorizedException('Unauthorized');

    // const items = auth.split(' ');
    // const idToken = items[1];

    // if (!idToken) throw new UnauthorizedException('Unauthorized');

    // try {
    //   const ticket = await this.googleClient.verifyIdToken({
    //     idToken: idToken,
    //     audience: this.googleClientId,
    //   });

    //   const payload = ticket.getPayload();
    //   const user = {
    //     id: payload.sub,
    //     name: payload.name,
    //     email: payload.email,
    //   };
    // } catch (error) {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }
}
