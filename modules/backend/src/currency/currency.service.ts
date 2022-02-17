import { Injectable, Logger } from '@nestjs/common';
import { PaginationParams } from '../util/type/PaginationParams';
import { FilterParams } from '../util/type/FilterParams';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyRate, CurrencyType } from './entity';
import { Connection, Repository } from 'typeorm';
import { SortingOrderEnum } from '../util/type/SortingParams';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(CurrencyType)
    private currencyTypeRepository: Repository<CurrencyType>,
    @InjectRepository(CurrencyRate)
    private currencyRateRepository: Repository<CurrencyRate>,
    private connection: Connection,
  ) {}

  async getCurrenciesRates(
    paginationParams: PaginationParams,
    sortingParams: Record<string, SortingOrderEnum.asc | SortingOrderEnum.desc>,
    filterParams: FilterParams,
  ): Promise<[CurrencyRate[], number]> {
    const defaultItemsLimit = 5;
    let queryBuilder = this.currencyRateRepository
      .createQueryBuilder('currency_rate')
      .select(
        [
          'currency_rate.id as id',
          filterParams.date
            ? 'MAX(currency_rate.start_date) as max_start_date'
            : '',
          'currency_rate.start_date as start_date',
          'currency_rate.rate as rate',
          'currency_type.currency_code as currency_code',
          'currency_type.currency_id as currency_id',
        ]
          .filter(Boolean)
          .join(),
      )
      .leftJoin('currency_rate.currency_type', 'currency_type');

    if (filterParams.date) {
      // todo @dimazoll - need to build query using query builder
      // select max(start_date), * from currency_rate
      // where start_date <= '2021-07-10 21:00:00.000'
      // group by currency_id
      queryBuilder = queryBuilder
        .andWhere('start_date <= :date', { date: filterParams.date.eq })
        .groupBy('currency_rate.currency_id');
    }

    if (filterParams.currency) {
      queryBuilder = queryBuilder.andWhere(
        'currency_type.currency_code IN (:currency_codes)',
        {
          currency_codes: filterParams.currency.in,
        },
      );
    }

    // todo @dimazoll - use connection for that purpose
    const [{ cnt }] = await this.connection
      .createQueryRunner()
      .query(
        'SELECT COUNT(*) AS cnt FROM (' +
          queryBuilder.getQuery().replaceAll(/:\w+/gm, '?') +
          ')',
        [filterParams.date?.eq, filterParams?.currency?.in].filter(Boolean),
      );

    queryBuilder = queryBuilder.orderBy(sortingParams);
    queryBuilder = queryBuilder
      .limit(paginationParams.limit ?? defaultItemsLimit)
      .offset(paginationParams.offset);

    this.logger.debug('Query -> ' + queryBuilder.getQuery());

    const rawItems = await queryBuilder.getRawMany();
    const items = rawItems.map((rawItem) => {
      return this.currencyRateRepository.create({
        id: rawItem.id,
        rate: rawItem.rate,
        start_date: rawItem.start_date,
        currency_type: {
          currency_id: rawItem.currency_id,
          currency_code: rawItem.currency_code,
        },
      });
    });
    this.currencyRateRepository.create();

    // todo @dimazoll - remove logger
    this.logger.log('items: ' + JSON.stringify(items, null, 2));
    return [items, cnt];
  }
}
