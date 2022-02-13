import {
  ArrayNotEmpty,
  ArrayUnique,
  IsAlpha,
  IsArray,
  IsDate, IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {Type} from "class-transformer";

class CurrencyFilter {
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsAlpha(undefined, { each: true })
  @Length(3, 3, { each: true })
  in: string[];
}

class DateFilter {
  @IsDate()
  @IsOptional()
  eq?: Date;

  // todo @dimazoll - remove or implement
  // @IsDate()
  // @IsOptional()
  // lt?: Date;
  //
  // @IsDate()
  // @IsOptional()
  // gt?: Date;
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
