import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import admin from 'firebase-admin';

@Injectable()
export class AuthService {
  async validate(token: string) {
    const decodedToken = await admin
      .auth()
      .verifyIdToken(token)
      .catch(() => {
        Logger.error('Unauthorized');
        throw new UnauthorizedException();
      });

    if (!decodedToken) throw new UnauthorizedException();

    return decodedToken.uid;
  }

  async validateSocket(token: string) {
    const decodedToken = await admin
      .auth()
      .verifyIdToken(token)
      .catch(() => {
        Logger.error('Unauthorized');
        throw new WsException('Invalid credentials.');
      });

    if (!decodedToken) throw new WsException('Invalid credentials.');

    return decodedToken.uid;
  }
}
