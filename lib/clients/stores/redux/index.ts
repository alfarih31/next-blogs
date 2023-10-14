import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { sessionApi } from '$clients/api';
import rootReducers from './reducers';

const middlewares = [thunk];

const composedEnhancers = composeWithDevTools(applyMiddleware(...middlewares));

const store = configureStore({
  reducer: {
    ...rootReducers,
    [sessionApi.reducerPath]: sessionApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([sessionApi.middleware]),
  enhancers: [composedEnhancers],
});

export type State = ReturnType<typeof store.getState>;
export default store;
