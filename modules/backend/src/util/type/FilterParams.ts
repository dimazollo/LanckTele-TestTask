import {
  ArrayNotEmpty,
  ArrayUnique,
  IsAlpha,
  IsArray,
  IsDateString,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CurrencyFilter {
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsAlpha(undefined, { each: true })
  @Length(3, 3, { each: true })
  in: string[];
}

class DateFilter {
  @IsDateString()
  eq: string;
}

export class FilterParams {
  @IsOptional()
  @ValidateNested()
  @Type(() => CurrencyFilter)
  currency?: CurrencyFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilter)
  date?: DateFilter;
}
