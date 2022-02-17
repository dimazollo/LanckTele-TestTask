import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import {
  incrementAsyncEpic,
  incrementIfOddEpic,
} from '../features/counter/counterSlice';
import { AppEpic } from './store';

const epics = [incrementIfOddEpic, incrementAsyncEpic];

export const rootEpic: AppEpic = (action$, state$, deps) => {
  const combinedEpic = combineEpics(...epics);
  return combinedEpic(action$, state$, deps).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );
};
