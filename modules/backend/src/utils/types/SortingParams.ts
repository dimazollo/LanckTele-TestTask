import { IsOptional, Matches } from 'class-validator';

export class SortingParams {
  @IsOptional()
  @Matches(/^\w+\.(asc|desc)$/i, {
    each: true,
  })
  sort_by: string[];
}
