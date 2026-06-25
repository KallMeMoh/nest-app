import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { CryptoModule } from './crypto/crypto.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule, // global
    DatabaseModule, // global
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.redisUrl,
      }),
    }), // global
    CryptoModule, // global
    MailModule, //global
    // features
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
