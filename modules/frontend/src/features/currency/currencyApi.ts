import { httpClient } from '../../app/httpClient';
import { DateTimeFormatter, getTypedObjectKeys } from '../../utils';
import {
  CurrencyRateDto,
  FetchCurrencyDataParameters,
  UpdateCurrencyRowData,
} from './types';

export const fetchCurrencyData = async (
  params?: FetchCurrencyDataParameters,
): Promise<UpdateCurrencyRowData> => {
  let effectiveParams: Required<FetchCurrencyDataParameters> = {
    filters: {},
    sorting: {},
    paging: {},
  };

  if (params) {
    effectiveParams = getTypedObjectKeys(effectiveParams).reduce<
      Required<FetchCurrencyDataParameters>
    >((acc, key) => {
      acc[key] = {
        ...effectiveParams[key],
        ...(params[key] ?? {}),
      };
      return acc;
    }, effectiveParams);
    // todo @dimazoll - remove console.log expressions
    console.log('effectiveParams.paging', effectiveParams.paging);
    console.log('effectiveParams.sorting', effectiveParams.sorting);
  }

  const sortBy = getTypedObjectKeys(effectiveParams.sorting).map(
    (key) => `${key}.${effectiveParams.sorting[key]}`,
  );
  const preparedParams = {
    sort_by: sortBy.length > 0 ? sortBy : undefined,
    currency: effectiveParams.filters.currency
      ? { in: effectiveParams.filters.currency }
      : undefined,
    date: effectiveParams.filters.date
      ? { eq: effectiveParams.filters.date }
      : undefined,
    limit: effectiveParams.paging.limit,
    offset: effectiveParams.paging.offset,
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
