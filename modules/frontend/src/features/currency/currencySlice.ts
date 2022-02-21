import {
  createAction,
  createSlice,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AppEpic, RootState } from '../../app/store';
import { concatMap, filter, map, switchMap } from 'rxjs/operators';
import { fetchCurrencyCodes, fetchCurrencyData } from './currencyApi';
import {
  CurrencyData,
  CurrencyRowData,
  CurrencyType,
  FetchCurrencyDataParameters,
  Id,
  UpdateCurrencyRowData,
} from './types';

export interface CurrencyState {
  // todo @dimazoll - use or remove
  // status: 'idle' | 'loading' | 'failed';
  rowData: Record<Id, CurrencyData>;
  rowIds: Id[];
  total: number;
  currencyTypes: CurrencyType[];
}

const initialState: CurrencyState = {
  rowData: {},
  rowIds: [],
  total: 0,
  currencyTypes: [],
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    updateRowData: (
      state: Draft<CurrencyState>,
      action: PayloadAction<UpdateCurrencyRowData>,
    ) => {
      action.payload.items.forEach((currencyItem) => {
        if (!state.rowData[currencyItem.id]) {
          state.rowIds.push(currencyItem.id);
        }
        state.rowData[currencyItem.id] = currencyItem;
      });
      state.total = action.payload.total;
    },
    updateCurrencyTypes: (
      state: Draft<CurrencyState>,
      action: PayloadAction<CurrencyType[]>,
    ) => {
      state.currencyTypes = action.payload;
    },
  },
});

export const { updateRowData, updateCurrencyTypes } = currencySlice.actions;

// Selectors section.
// Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRowData = (state: RootState): CurrencyRowData[] =>
  state.currency.rowIds.map((id) => {
    const rowDatum = state.currency.rowData[id];
    return {
      currencyCode: rowDatum.currencyCode,
      startDate: rowDatum.startDate,
      currencyRate: rowDatum.currencyRate,
    };
  });

export const selectRowIds = (state: RootState): Id[] => state.currency.rowIds;

// Epic section
export const initCurrencySlice = createAction('currency/Init');

export const initCurrencySliceEpic: AppEpic = (action$) =>
  action$.pipe(
    filter(initCurrencySlice.match),
    concatMap(() => [
      fetchCurrencyCodesAction(),
      // todo @dimazoll - use default params object in this case.
      //  Next rows must be loaded lazily.
      fetchCurrencyDataAction(),
    ]),
  );

export const fetchCurrencyCodesAction = createAction(
  'currency/FetchCurrencyCodes',
);

export const fetchCurrencyCodesEpic: AppEpic = (action$) =>
  action$.pipe(
    filter(fetchCurrencyCodesAction.match),
    switchMap(() => fetchCurrencyCodes()),
    map((data) => updateCurrencyTypes(data)),
  );

export const fetchCurrencyDataAction = createAction<
  FetchCurrencyDataParameters | undefined
>('currency/FetchCurrencyData');

export const fetchCurrencyDataEpic: AppEpic = (action$) =>
  action$.pipe(
    filter(fetchCurrencyDataAction.match),
    switchMap((action) => fetchCurrencyData(action.payload)),
    map((data) => updateRowData(data)),
  );
