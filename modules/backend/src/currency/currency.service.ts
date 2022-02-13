import { Injectable, Logger } from '@nestjs/common';
import { PaginationParams } from '../utils/types/PaginationParams';
import { FilterParams } from '../utils/types/FilterParams';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyRate, CurrencyType } from './entity';
import { FindConditions, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  constructor(
    @InjectRepository(CurrencyType)
    private currencyTypeRepository: Repository<CurrencyType>,
    @InjectRepository(CurrencyRate)
    private currencyRateRepository: Repository<CurrencyRate>,
  ) {}

  async getCurrenciesRates(
    paginationParams: PaginationParams,
    sortingParams: Record<string, 'asc' | 'desc'>,
    filterParams: FilterParams,
  ): Promise<[CurrencyRate[], number]> {
    const defaultItemsLimit = 5;
    const whereObject: FindConditions<CurrencyRate> = {};
    if (filterParams.currency) {
      whereObject.currency_type = {
        currency_code: In(filterParams.currency.in),
      };
    }

    if (filterParams.date) {
      // todo @dimzoll - need to use window function and query builder
      // select max(start_date), * from currency_rate
      // where start_date <= '2021-07-10 21:00:00.000'
      // group by currency_id
    }

    const [items, count] = await this.currencyRateRepository.findAndCount({
      skip: paginationParams.offset,
      take: paginationParams.limit || defaultItemsLimit,
      order: sortingParams,
      where: whereObject,
      relations: ['currency_type'],
    });
    // todo @dimazoll - remove logger
    this.logger.log('items: ' + JSON.stringify(items));
    this.logger.log('count: ' + count);
    return [items, count];
  }
}
