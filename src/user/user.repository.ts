import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import {
  Model,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { AuthProviderEnum } from '../auth/enums/auth-provider.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private verificationCode(userId: string) {
    return `user:verification-code:${userId}`;
  }

  private twoFAActivationCode(userId: string) {
    return `user:2fa-activation-code:${userId}`;
  }

  async existsByEmail(email: string) {
    return this.userModel.exists({ email });
  }

  async create(data: User) {
    return this.userModel.create(data);
  }

  async findByUsername(username: string, projection?: ProjectionType<User>) {
    return this.userModel.findOne({ username }, projection).lean();
  }

  async findByEmail(email: string, projection?: ProjectionType<User>) {
    return this.userModel.findOne({ email }, projection).lean();
  }

  async findById(userId: Types.ObjectId, projection?: ProjectionType<User>) {
    return this.userModel.findOne({ _id: userId }, projection).lean();
  }

  async findByEmailAndProvider(email: string, provider: AuthProviderEnum) {
    return this.userModel.findOne({ email, provider }).lean();
  }

  updateById(
    userId: Types.ObjectId,
    updates: UpdateQuery<User> | UpdateWithAggregationPipeline,
    options?: QueryOptions<User>,
  ) {
    return this.userModel.findOneAndUpdate({ _id: userId }, updates, options);
  }

  deleteById(userId: Types.ObjectId) {
    return this.userModel.updateOne({ _id: userId }, { deletedAt: new Date() });
  }

  updatePassword(userId: Types.ObjectId, hashedPassword: string) {
    return this.userModel.updateOne(
      { _id: userId },
      { $set: { hashed_password: hashedPassword } },
    );
  }

  async getVerificationCode(userId: Types.ObjectId) {
    return this.redisClient.get(this.verificationCode(userId.toString()));
  }

  async setVerificationCode(userId: Types.ObjectId, code: string) {
    return this.redisClient.set(
      this.verificationCode(userId.toString()),
      code,
      'EX',
      300,
    );
  }

  async delVerificationCode(userId: Types.ObjectId) {
    return this.redisClient.del(this.verificationCode(userId.toString()));
  }

  async verificationCodeExists(userId: Types.ObjectId) {
    return this.redisClient.exists(this.verificationCode(userId.toString()));
  }

  async get2FAActivationCode(userId: Types.ObjectId) {
    return this.redisClient.get(this.twoFAActivationCode(userId.toString()));
  }

  async set2FAActivationCode(userId: Types.ObjectId, code: string) {
    return this.redisClient.set(
      this.twoFAActivationCode(userId.toString()),
      code,
      'EX',
      300,
    );
  }

  async del2FAActivationCode(userId: Types.ObjectId) {
    return this.redisClient.del(this.twoFAActivationCode(userId.toString()));
  }

  async twoFAActivationCodeExists(userId: Types.ObjectId) {
    return this.redisClient.exists(this.twoFAActivationCode(userId.toString()));
  }
}
