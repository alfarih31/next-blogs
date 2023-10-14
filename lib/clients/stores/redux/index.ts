import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { blogApi, publicApi, sessionApi } from '$clients/api';
import rootReducers from './reducers';

const middlewares = [thunk];

const composedEnhancers = composeWithDevTools(applyMiddleware(...middlewares));

const store = configureStore({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  reducer: {
    ...rootReducers,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([sessionApi.middleware, blogApi.middleware, publicApi.middleware]),
  enhancers: [composedEnhancers],
});

export type State = ReturnType<typeof store.getState>;
export default store;
