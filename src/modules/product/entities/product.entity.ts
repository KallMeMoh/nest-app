import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { slugify } from 'transliteration';
import { Brand } from '../../brand/entities/brand.entity';
import { Category } from '../../category/entities/category.entity';
import { Subcategory } from '../../subcategory/entities/subcategory.entity';
import { DiscounTypeEnum } from '../enums/discount-type.enum';
import { Review } from '../../review/entities/review.entity';
import { CreationStatusEnum } from '../../../common/enums/creation-status.enum';

@Schema({
  timestamps: true,
  strictQuery: true,
  optimisticConcurrency: true,
})
export class Product {
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
    required: true,
  })
  description!: string;

  @Prop({
    type: Number,
    required: true,
  })
  price!: number;

  @Prop({
    type: {
      type: {
        type: DiscounTypeEnum,
        enum: Object.values(DiscounTypeEnum),
        default: DiscounTypeEnum.Amount,
      },
      value: { type: Number, default: 0 },
    },
    required: true,
  })
  discount!: {
    type: DiscounTypeEnum;
    value: number;
  };

  @Prop({
    type: Number,
    required: true,
  })
  stock!: number;

  @Prop({
    type: {
      avg: { type: Number, default: 0 },
      reviews: {
        type: [Types.ObjectId],
        default: [],
        ref: Review.name,
      },
    },
    required: true,
  })
  rating!: {
    avg: number;
    reviews: [Types.ObjectId];
  };

  @Prop({
    type: String,
    default: null,
  })
  logoKey!: string | null;

  @Prop({
    type: [String],
    default: [],
  })
  galleryKeys!: string[];

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Subcategory.name,
  })
  subcategory!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Brand.name,
  })
  brand!: Types.ObjectId;

  @Prop({
    type: String,
    enum: CreationStatusEnum,
    default: CreationStatusEnum.Draft,
  })
  status: CreationStatusEnum = CreationStatusEnum.Draft;

  createdAt!: Date;
  updatedAt!: Date;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('validate', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { separator: '_' });
  }
});
