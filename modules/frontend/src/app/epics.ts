import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';

import { AppEpic } from './store';
import {
  fetchCurrencyCodesEpic,
  fetchCurrencyDataEpic,
  initCurrencyDataEpic,
  refetchDataOnSorting,
} from '../features/currency/currencySlice';

const epics = [
  initCurrencyDataEpic,
  fetchCurrencyDataEpic,
  fetchCurrencyCodesEpic,
  refetchDataOnSorting,
];

export const rootEpic: AppEpic = (action$, state$, deps) => {
  const combinedEpic = combineEpics(...epics);
  return combinedEpic(action$, state$, deps).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );
};
