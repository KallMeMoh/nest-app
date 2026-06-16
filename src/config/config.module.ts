import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('production', 'development', 'test')
          .default('production'),

        PORT: Joi.number().default(3000),

        DB_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),

        SALT_ROUNDS: Joi.number().default(10),

        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_PENDING_AUTH_SECRET: Joi.string().required(),

        SMTP_USER: Joi.string().required(),
        SMTP_PASS: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),

        FRONTEND_URL: Joi.string().required(),

        R2_BUCKET_NAME: Joi.string().required(),
        R2_ACCOUNT_ID: Joi.string().required(),
        R2_ACCESS_KEY_ID: Joi.string().required(),
        R2_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
