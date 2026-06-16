import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get nodeEnv() {
    return this.config.get<string>('NODE_ENV', 'production');
  }

  get port() {
    return this.config.get<number>('PORT', 3000);
  }

  get databaseUrl() {
    return this.config.getOrThrow<string>('DB_URL');
  }

  get redisUrl() {
    return this.config.getOrThrow<string>('REDIS_URL');
  }

  get saltRounds() {
    return this.config.get<number>('SALT_ROUNDS', 10);
  }

  // get encryptionKey() {
  //   return this.config.getOrthrow<string>('ENCRYPTION_KEY');
  // }
  // get encryptionAlgo() {
  //   return this.config.getOrthrow<string>('ENCRYPTION_ALGO');
  // }

  get accessSecret() {
    return this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
  }

  get refreshSecret() {
    return this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  get pendingAuthSecret() {
    return this.config.getOrThrow<string>('JWT_PENDING_AUTH_SECRET');
  }

  get smtpUser() {
    return this.config.getOrThrow<string>('SMTP_USER');
  }
  get smtpPass() {
    return this.config.getOrThrow<string>('SMTP_PASS');
  }

  get googleClient() {
    return this.config.getOrThrow<string>('GOOGLE_CLIENT_ID');
  }

  // get googleClientSecret() {
  //   return this.config.getOrThrow<string>('GOOGLE_CLIENT_SECRET');
  // }

  get frontendUrl() {
    return this.config.getOrThrow<string>('FRONTEND_URL');
  }

  get r2BucketName() {
    return this.config.getOrThrow<string>('R2_BUCKET_NAME');
  }
  get r2AccountId() {
    return this.config.getOrThrow<string>('R2_ACCOUNT_ID');
  }
  get r2AccessKeyId() {
    return this.config.getOrThrow<string>('R2_ACCESS_KEY_ID');
  }
  get r2SecretAccessKey() {
    return this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY');
  }
}
