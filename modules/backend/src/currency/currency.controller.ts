import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PaginationParams } from '../util/type/PaginationParams';
import { CurrencyService } from './currency.service';
import { FilterParams } from '../util/type/FilterParams';
import { IntersectionType } from '@nestjs/mapped-types';
import { SortingOrderEnum, SortingParams } from '../util/type/SortingParams';
import { CurrencyRateDto } from './dto/currencyRate.dto';

class GetCurrencyQueryParams extends IntersectionType(
  FilterParams,
  PaginationParams,
  SortingParams,
) {}

interface GetCurrencyRatesResponse {
  items: CurrencyRateDto[];
  total: number;
}

interface GetCurrencyTypesResponse {
  items: string[];
}

@Controller('currency')
export class CurrencyController {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/types')
  async getCurrencyTypes(): Promise<GetCurrencyTypesResponse> {
    const currencyTypes = await this.currencyService.getCurrencyTypes();
    const items = currencyTypes.map((item) => item.currency_code);
    return { items };
  }

  @Get('/rates')
  async getCurrencyRates(
    @Query() query: GetCurrencyQueryParams,
  ): Promise<GetCurrencyRatesResponse> {
    // todo @dimazoll - remove logger
    this.logger.debug('queryParams: ' + JSON.stringify(query, null, 2));
    const paginationParams = { limit: query.limit, offset: query.offset };
    const filterParams = { date: query.date, currency: query.currency };
    const sortingRules = (query.sort_by ?? []).reduce((acc, item) => {
      const [column, order] = item.split('.');
      acc[column] = order || SortingOrderEnum.ASC;
      return acc;
    }, {});

    const [rates, total] = await this.currencyService.getCurrencyRates(
      paginationParams,
      sortingRules,
      filterParams,
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
