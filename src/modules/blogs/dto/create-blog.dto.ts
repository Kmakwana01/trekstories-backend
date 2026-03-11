import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { BlogCategory } from '../../../common/enums/blog-category.enum';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsEnum(BlogCategory)
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  @IsUrl()
  featuredImage?: string;
}
