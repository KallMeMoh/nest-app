import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { slugify } from 'transliteration';
import { CreationStatusEnum } from '../../../common/enums/creation-status.enum';

@Schema({
  timestamps: true,
  strictQuery: true,
  optimisticConcurrency: true,
})
export class Brand {
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

export type BrandDocument = HydratedDocument<Brand>;
export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre('validate', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { separator: '_' });
  }
});
