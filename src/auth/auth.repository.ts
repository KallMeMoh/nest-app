import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Redis } from 'ioredis';

@Injectable()
export class AuthRepository {
  private readonly KEYS = {
    loginCounter: (userId: Types.ObjectId) =>
      `auth:login-counter:${userId.toString()}`,
    passwordReset: (token: string) => `auth:password-reset:${token}`,
    login2FA: (userId: Types.ObjectId) => `auth:login-2fa:${userId.toString()}`,
    jwtBlacklist: (jti: string) => `jwt:blacklist:${jti}`,
  } as const;

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async getLoginAttempts(userId: Types.ObjectId) {
    return this.redisClient.get(this.KEYS.loginCounter(userId));
  }

  async incrementLoginAttempts(userId: Types.ObjectId) {
    const count = await this.redisClient.incr(this.KEYS.loginCounter(userId));
    if (count === 1) {
      await this.redisClient.expire(this.KEYS.loginCounter(userId), 1800);
    }
    return count;
  }

  async resetLoginAttempts(userId: Types.ObjectId) {
    return this.redisClient.del(this.KEYS.loginCounter(userId));
  }

  async setPasswordResetToken(token: string, userId: Types.ObjectId) {
    return this.redisClient.set(
      this.KEYS.passwordReset(token),
      userId.toString(),
      'EX',
      300,
    );
  }

  async getPasswordResetToken(token: string) {
    return this.redisClient.get(this.KEYS.passwordReset(token));
  }

  async store2FACode(userId: Types.ObjectId, code: string) {
    return this.redisClient.set(this.KEYS.login2FA(userId), code, 'EX', 300);
  }

  async get2FACode(userId: Types.ObjectId) {
    return this.redisClient.get(this.KEYS.login2FA(userId));
  }

  async blacklistToken(jti: string) {
    return this.redisClient.set(
      this.KEYS.jwtBlacklist(jti),
      '1',
      'EX',
      365 * 24 * 60 * 60,
    );
  }
}
