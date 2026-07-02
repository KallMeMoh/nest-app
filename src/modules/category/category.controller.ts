import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreationStatusEnum } from '../../common/enums/creation-status.enum';
import { R2BucketService } from '../bucket/bucket.service';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly r2BucketService: R2BucketService,
  ) {}

  @Post()
  async create(@Body() createCategoryDto: CategoryDto) {
    const { logoKey, ...category } =
      await this.categoryService.create(createCategoryDto);

    let uploadUrl: string | null = null;
    if (createCategoryDto.logo_mimetype && logoKey)
      uploadUrl = await this.r2BucketService.generateUploadUrl(
        logoKey,
        createCategoryDto.logo_mimetype.split('/')[1],
      );

    return { category, uploadUrl };
  }

  @Post(':id/confirm')
  async confirmCategoryCreation(@Param('id') categoryId: string) {
    const category =
      await this.categoryService.confirmCategoryCreation(categoryId);
    if (!category.logoKey) {
      category.status = CreationStatusEnum.Published;
      await category.save();
    } else {
      const exists = await this.r2BucketService.fileExists(category.logoKey);
      if (!exists)
        throw new UnprocessableEntityException(
          'Some files failed to upload, please try again',
        );
    }

    return { message: 'Category creation confirmed successfully' };
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findOne(slug);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<CategoryDto>,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
