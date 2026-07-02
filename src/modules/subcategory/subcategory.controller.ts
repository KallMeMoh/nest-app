import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryDto } from './dto/subcategory.dto';
import { R2BucketService } from '../bucket/bucket.service';
import { CreationStatusEnum } from '../../common/enums/creation-status.enum';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly subcategoryService: SubcategoryService,
    private readonly r2BucketService: R2BucketService,
  ) {}

  @Post()
  async create(@Body() createSubcategoryDto: SubcategoryDto) {
    const { logoKey, ...subcategory } =
      await this.subcategoryService.create(createSubcategoryDto);

    let uploadUrl: string | null = null;
    if (createSubcategoryDto.logo_mimetype && logoKey)
      uploadUrl = await this.r2BucketService.generateUploadUrl(
        logoKey,
        createSubcategoryDto.logo_mimetype.split('/')[1],
      );

    return { subcategory, uploadUrl };
  }

  @Post(':id/confirm')
  async confirmSubcategoryCreation(@Param('id') subcategoryId: string) {
    const subcategory =
      await this.subcategoryService.confirmSubcategoryCreation(subcategoryId);
    if (!subcategory.logoKey) {
      subcategory.status = CreationStatusEnum.Published;
      await subcategory.save();
    } else {
      const exists = await this.r2BucketService.fileExists(subcategory.logoKey);
      if (!exists)
        throw new UnprocessableEntityException(
          'Some files failed to upload, please try again',
        );
    }

    return { message: 'Subcategory creation confirmed successfully' };
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<SubcategoryDto>,
  ) {
    return this.subcategoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }
}
