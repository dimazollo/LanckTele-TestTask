import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PaginationParams } from '../util/type/PaginationParams';
import { CurrencyService } from './currency.service';
import { FilterParams } from '../util/type/FilterParams';
import { IntersectionType } from '@nestjs/mapped-types';
import { SortingOrderEnum, SortingParams } from '../util/type/SortingParams';
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
  async getCurrenciesRates(
    @Query() query: GetCurrenciesQueryParams,
  ): Promise<GetCurrenciesRatesResponse> {
    // todo @dimazoll - remove logger
    this.logger.debug('queryParams: ' + JSON.stringify(query, null, 2));
    const sortingRules = (query.sort_by ?? []).reduce((acc, item) => {
      const [column, order] = item.split('.');
      acc[column] = order.toUpperCase() || SortingOrderEnum.asc;
      return acc;
    }, {});

    const [rates, total] = await this.currencyService.getCurrenciesRates(
      { limit: query.limit, offset: query.offset },
      sortingRules,
      { date: query.date, currency: query.currency },
    );
    return {
      items: rates.map((item) => {
        return {
          currency_rate: item.rate,
          currency_code: item.currency_type.currency_code,
          start_date: item.start_date,
          id: String(item.id),
        };
      }),
      total,
    };
  }
}
