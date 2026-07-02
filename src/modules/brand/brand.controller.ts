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
import { BrandService } from './brand.service';
import { BrandDto } from './dto/brand.dto';
import { R2BucketService } from '../bucket/bucket.service';
import { CreationStatusEnum } from '../../common/enums/creation-status.enum';

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly r2BucketService: R2BucketService,
  ) {}

  @Post()
  async create(@Body() createBrandDto: BrandDto) {
    const { logoKey, ...brand } =
      await this.brandService.create(createBrandDto);

    let uploadUrl: string | null = null;
    if (createBrandDto.logo_mimetype && logoKey)
      uploadUrl = await this.r2BucketService.generateUploadUrl(
        logoKey,
        createBrandDto.logo_mimetype.split('/')[1],
      );

    return { brand, uploadUrl };
  }

  @Post(':id/confirm')
  async confirmBrandCreation(@Param('id') brandId: string) {
    const brand = await this.brandService.confirmBrandCreation(brandId);
    if (!brand.logoKey) {
      brand.status = CreationStatusEnum.Published;
      await brand.save();
    } else {
      const exists = await this.r2BucketService.fileExists(brand.logoKey);
      if (!exists)
        throw new UnprocessableEntityException(
          'Some files failed to upload, please try again',
        );
    }

    return { message: 'Brand creation confirmed successfully' };
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.brandService.findOne(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: Partial<BrandDto>) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
