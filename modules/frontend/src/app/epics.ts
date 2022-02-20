import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';

import { AppEpic } from './store';
import {
  fetchCurrencyCodesEpic,
  fetchCurrencyDataEpic,
  initCurrencySliceEpic,
} from '../features/currency/currencySlice';

const epics = [
  initCurrencySliceEpic,
  fetchCurrencyDataEpic,
  fetchCurrencyCodesEpic,
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
