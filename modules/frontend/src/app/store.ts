import { configureStore, combineReducers, AnyAction } from '@reduxjs/toolkit';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { rootEpic } from './epics';
import { currencySlice } from '../features/currency/currencySlice';

const reducer = combineReducers({
  currency: currencySlice.reducer,
});

const epicMiddleware = createEpicMiddleware<
  AnyAction,
  AnyAction,
  RootState,
  unknown
>();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return [...getDefaultMiddleware({ thunk: false }), epicMiddleware];
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof reducer>;
export type AppEpic = Epic<AnyAction, AnyAction, RootState, unknown>;

epicMiddleware.run(rootEpic);
