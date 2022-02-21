export type CurrencyRowData = Omit<CurrencyData, 'id'>;

export type CurrencyType = string;
export type Id = string;

export enum SortingColumnEnum {
  START_DATE = 'start_date',
  CURRENCY_CODE = 'currency_code',
}

export enum SortingOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export interface FilterParams {
  currency?: string[];
  date?: string;
}

export interface PagingParams {
  limit: number;
  offset: number;
}

export type SortingParams = Record<SortingColumnEnum, SortingOrderEnum>;

export interface FetchCurrencyDataParameters {
  filters?: FilterParams;
  sorting?: Partial<SortingParams>;
  paging?: Partial<PagingParams>;
}

export interface CurrencyData {
  id: string;
  currencyCode: string;
  currencyRate: number;
  startDate: string;
}

export interface UpdateCurrencyRowData {
  items: CurrencyData[];
  total: number;
}

export interface CurrencyRateDto {
  id: string;
  currency_code: string;
  currency_rate: number;
  start_date: string;
}
