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
  FilterParams,
  Id,
  SortingParams,
  UpdateCurrencyRowData,
} from './types';
import { typedHasOwnProperty } from '../../utils';

export interface CurrencyState {
  rowData: Record<Id, CurrencyData>;
  rowIds: Id[];
  sorting: SortingParams;
  filters: FilterParams;
  total: number;
  currencyTypes: CurrencyType[];
}

const initialState: CurrencyState = {
  rowData: {},
  rowIds: [],
  sorting: {},
  filters: {},
  total: 20,
  currencyTypes: [],
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    clearRowData: (state: Draft<CurrencyState>) => {
      state.total = initialState.total;
      state.rowData = initialState.rowData;
      state.rowIds = initialState.rowIds;
    },
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
    updateFilters: (
      state: Draft<CurrencyState>,
      action: PayloadAction<FilterParams>,
    ) => {
      if (typedHasOwnProperty(action.payload, 'currency')) {
        state.filters.currency = action.payload.currency;
      }
      if (typedHasOwnProperty(action.payload, 'date')) {
        state.filters.date = action.payload.date;
      }
    },
    updateSorting: (
      state: Draft<CurrencyState>,
      action: PayloadAction<SortingParams>,
    ) => {
      state.sorting = action.payload;
    },
  },
});

export const {
  clearRowData: clearRowDataAction,
  updateRowData: updateRowDataAction,
  updateCurrencyTypes: updateCurrencyTypesAction,
  updateSorting: updateSortingAction,
} = currencySlice.actions;

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
export const initCurrencyDataAction = createAction('currency/init');
export const initCurrencyDataEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(initCurrencyDataAction.match),
    concatMap(() => {
      // todo @dimazoll - make sure this is corrected
      const { filters, sorting } = state$.value.currency;
      console.log('initCurrencyData -> sorting = ', sorting);
      const actions = [
        clearRowDataAction(),
        // fetchCurrencyDataAction({
        //   sorting,
        //   filters,
        // }),
      ];
      if (state$.value.currency.currencyTypes.length === 0) {
        actions.push(fetchCurrencyCodesAction());
      }
      return actions;
    }),
  );

export const fetchCurrencyCodesAction = createAction(
  'currency/fetchCurrencyCodes',
);

export const fetchCurrencyCodesEpic: AppEpic = (action$) =>
  action$.pipe(
    filter(fetchCurrencyCodesAction.match),
    switchMap(() => fetchCurrencyCodes()),
    map((data) => updateCurrencyTypesAction(data)),
  );

export const fetchCurrencyDataAction = createAction<
  FetchCurrencyDataParameters | undefined
>('currency/fetchCurrencyData');

export const fetchCurrencyDataEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchCurrencyDataAction.match),
    switchMap((action) => {
      const { filters, sorting } = state$.value.currency;

      return fetchCurrencyData({
        filters,
        sorting,
        ...action.payload,
      });
    }),
    map((data) => updateRowDataAction(data)),
  );

export const refetchDataOnSorting: AppEpic = (action$) =>
  action$.pipe(
    filter(updateSortingAction.match),
    switchMap(() => {
      // todo @dimazoll - fix this
      return [clearRowDataAction() /*initCurrencyDataAction()*/];
    }),
  );
