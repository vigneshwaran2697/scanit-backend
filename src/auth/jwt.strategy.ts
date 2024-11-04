import { UserService } from '../modules/user/user.service';
import { User } from '../modules/user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfiguration } from './auth.configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authConfig: AuthConfiguration,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${_authConfig.getData().authority}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: _authConfig.getData().authority,
      algorithms: ['RS256'],
      ignoreExpiration: true,
    });
  }
  async validate(payload: any) {
    let isExpiredToken = false;
    const seconds = 1000;
    const date = new Date();
    const time = date.getTime();
    if (payload.exp < Math.round(time / seconds)) {
      isExpiredToken = true;
    }
    if (isExpiredToken) {
      throw new UnauthorizedException('ACCESS_TOKEN_EXPIRED');
    }
    const user: User = await this.userService.getUserByUserName(
      payload.username,
    );
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
