import { IsArray, IsOptional, Matches } from 'class-validator';
import { getSortableColumnsFromReflection } from '../reflection';
import { CurrencyRate, CurrencyType } from '../../currency/entity';

export enum SortingOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

const sortingKeyValues = [CurrencyRate, CurrencyType].flatMap((constructor) =>
  getSortableColumnsFromReflection(constructor),
);

const sortingOrderValues = Object.keys(SortingOrderEnum).map(
  (key) => SortingOrderEnum[key],
);

const sortingParamMatchingPattern = new RegExp(
  `^(${sortingKeyValues.join('|')})\\.(${sortingOrderValues.join('|')})$`,
  'i',
);

export class SortingParams {
  @IsOptional()
  @IsArray()
  @Matches(sortingParamMatchingPattern, {
    each: true,
  })
  sort_by?: string[];
}
