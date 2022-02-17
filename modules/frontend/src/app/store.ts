import { configureStore, combineReducers, AnyAction } from '@reduxjs/toolkit';
import { counterSlice } from '../features/counter/counterSlice';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { rootEpic } from './epics';

const reducer = combineReducers({
  counter: counterSlice.reducer,
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
    return [...getDefaultMiddleware({ thunk: false })];
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppEpic = Epic<AnyAction, AnyAction, RootState, unknown>;

epicMiddleware.run(rootEpic);
