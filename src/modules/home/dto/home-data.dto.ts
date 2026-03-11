import { ApiProperty } from '@nestjs/swagger';

export class HomeDataDto {
  @ApiProperty()
  filterOptions: any;

  @ApiProperty()
  featuredTours: any[];

  @ApiProperty()
  toursByState: any[];

  @ApiProperty()
  latestBlogs: any[];

  @ApiProperty()
  settings: any;
}
