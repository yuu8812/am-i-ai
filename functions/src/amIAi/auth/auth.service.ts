import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UserRepository } from 'src/amIAi/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(token: string): Promise<DecodedIdToken> {
    const decodedToken = await admin
      .auth()
      .verifyIdToken(token)
      .catch(() => {
        Logger.error('Unauthorized');
        throw new UnauthorizedException();
      });

    if (!decodedToken) throw new UnauthorizedException();

    return decodedToken;
  }

  async validateAndReturnUserId(
    token: string,
  ): Promise<{ userId: string; language: number }> {
    const decodedToken = await this.validate(token);
    if (!decodedToken) throw new UnauthorizedException();

    const user = await this.userRepository.findByAuthenticationId(
      decodedToken.uid,
    );

    return { userId: user.id, language: user.language };
  }
}
