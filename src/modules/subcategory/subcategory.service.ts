import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubcategoryRepository } from './subcategory.repository';
import { CategoryDto } from '../category/dto/category.dto';
import { randomUUID } from 'crypto';
import { slugify } from 'transliteration';
import { SubcategoryDto } from './dto/subcategory.dto';
import { Types } from 'mongoose';
import { CreationStatusEnum } from '../../common/enums/creation-status.enum';

@Injectable()
export class SubcategoryService {
  constructor(private readonly subcategoryRepository: SubcategoryRepository) {}

  async create({ name, logo_mimetype, categoryId }: SubcategoryDto) {
    let key: string | null = null;

    if (logo_mimetype)
      key = `subcategory/${Date.now()}_${randomUUID()}.${logo_mimetype.split('/')[1]}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, ...category } = await this.subcategoryRepository.create({
      name,
      slug: slugify(name, { separator: '-' }),
      logoKey: key,
      category: new Types.ObjectId(categoryId),
      status: logo_mimetype
        ? CreationStatusEnum.Draft
        : CreationStatusEnum.Published,
    });

    return category;
  }

  async confirmSubcategoryCreation(subcategoryId: string) {
    const subcategory =
      await this.subcategoryRepository.findById(subcategoryId);
    if (!subcategory) throw new NotFoundException("Subcategory doesn't exist");

    if (subcategory.status === CreationStatusEnum.Published)
      throw new ConflictException('Subcategory creation already confirmed');

    return subcategory;
  }

  findAll() {
    return this.subcategoryRepository.findAll();
  }

  findOne(slug: string) {
    return this.subcategoryRepository.findBySlug(slug);
  }

  update(slug: string, updateCategoryDto: Partial<CategoryDto>) {
    return this.subcategoryRepository.updateOne(slug, updateCategoryDto);
  }

  remove(id: string) {
    return this.subcategoryRepository.deleteOne(id);
  }
}
