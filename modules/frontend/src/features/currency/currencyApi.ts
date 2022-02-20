import { httpClient } from '../../app/httpClient';
import { DateTimeFormatter, getTypedObjectKeys } from '../../utils';
import {
  CurrencyRateDto,
  FetchCurrencyDataParameters,
  UpdateCurrencyRowData,
} from './types';

export const fetchCurrencyData = async (
  params: FetchCurrencyDataParameters = {
    filters: {},
    sorting: {},
    paging: {},
  },
): Promise<UpdateCurrencyRowData> => {
  const sortBy = getTypedObjectKeys(params.sorting).map(
    (key) => `${key}.${params.sorting[key]}`,
  );
  const preparedParams = {
    sort_by: sortBy.length > 0 ? sortBy : undefined,
    currency: params.filters.currency
      ? { in: params.filters.currency }
      : undefined,
    date: params.filters.date ? { eq: params.filters.date } : undefined,
    limit: params.paging.limit,
    offset: params.paging.offset,
  };

  const { data } = await httpClient.get<{
    items: CurrencyRateDto[];
    total: number;
  }>('/currency/rates', {
    params: preparedParams,
  });
  return {
    items: data.items.map((item) => ({
      id: item.id,
      currencyCode: item.currency_code,
      currencyRate: item.currency_rate,
      startDate: DateTimeFormatter.format(new Date(item.start_date)),
    })),
    total: data.total,
  };
};

export const fetchCurrencyCodes = async (): Promise<string[]> => {
  const response = await httpClient.get('/currency/types');
  return response.data?.items;
};
