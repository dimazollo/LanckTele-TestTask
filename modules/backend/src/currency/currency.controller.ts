import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PaginationParams } from '../utils/types/PaginationParams';
import { CurrencyService } from './currency.service';
import { FilterParams } from '../utils/types/FilterParams';
import { IntersectionType } from '@nestjs/mapped-types';
import { SortingParams } from '../utils/types/SortingParams';
import { CurrencyRateDto } from './dto/currencyRate.dto';

class GetCurrenciesQueryParams extends IntersectionType(
  FilterParams,
  PaginationParams,
  SortingParams,
) {}

interface GetCurrenciesRatesResponse {
  items: CurrencyRateDto[];
  total: number;
}

@Controller('currency')
export class CurrencyController {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/rate')
  // todo @dimazoll - remove "any[]"
  // todo @dimazoll - make interface
  async getCurrenciesRates(
    @Query() query: GetCurrenciesQueryParams,
  ): Promise<GetCurrenciesRatesResponse> {
    // todo @dimazoll - remove logger
    this.logger.debug('query: ' + JSON.stringify(query, null, 2));
    const sortingRules = (query.sort_by || []).reduce((acc, item) => {
      const [column, order] = item.split('.');
      // todo @dimazoll: asc|desc - create enumeration for them
      acc[column] = order || 'asc';
      return acc;
    }, {});
    const [rates, total] = await this.currencyService.getCurrenciesRates(
      {},
      sortingRules,
      {},
    );
    return {
      items: rates.map((item) => {
        this.logger.log(JSON.stringify(item))
        return {
          currencyRate: item.rate,
          currencyCode: item.currency_type.currency_code,
          startDate: item.start_date,
          id: String(item.id),
        };
      }),
      total,
    };
  }
}
