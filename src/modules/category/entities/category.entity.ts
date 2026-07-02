import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CreationStatusEnum } from '../../../common/enums/creation-status.enum';

@Schema({
  timestamps: true,
  strictQuery: true,
  optimisticConcurrency: true,
})
export class Category {
  _id!: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  slug!: string;

  @Prop({
    type: String,
    default: null,
  })
  logoKey!: string | null;

  @Prop({
    type: String,
    enum: CreationStatusEnum,
    default: CreationStatusEnum.Draft,
  })
  status: CreationStatusEnum = CreationStatusEnum.Draft;

  createdAt!: Date;
  updatedAt!: Date;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
