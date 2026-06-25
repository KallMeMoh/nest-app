import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { ConfigService } from '../../config/config.service';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}
  async canActivate(context: ExecutionContext) {
    const type = context.getType();

    if (type === 'http') {
      const req = context.switchToHttp().getRequest<Request>();
      const header = req.headers.authorization;

      if (!header?.startsWith('Bearer '))
        throw new UnauthorizedException('Invalid Authorization Header');

      const token = header.split(' ')[1]?.trim();
      let payload: { sub?: string; jti?: string };
      try {
        payload = this.jwtService.verify<{ sub?: string; jti?: string }>(
          token,
          {
            secret: this.configService.accessSecret,
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        throw new UnauthorizedException('Invalid or malformed token');
      }

      if (
        !payload.jti ||
        !payload.sub ||
        (await this.redisClient.get(`jwt:blacklist:${payload.jti}`))
      )
        throw new UnauthorizedException('Invalid or malformed token');

      const user = await this.userRepository.findById(
        new Types.ObjectId(payload.sub),
      );
      if (!user) throw new UnauthorizedException('Invalid or malformed token');

      req.user = user;

      return true;
    } else {
      throw new UnauthorizedException('Unsupported transport');
    }
  }
}
