import { createApi } from '@reduxjs/toolkit/query/react';
import { UPDATE_SESSION } from '$clients/stores/redux/events';
import BrowserUtils from '$clients/browser-utils';
import HTTPClient, { HTTP_METHOD } from '$clients/http-client';

export const sessionApi = createApi({
  baseQuery: new HTTPClient({ basePath: '/api/auth' }).toQueryClient(),
  tagTypes: ['session'],
  endpoints: (builder) => ({
    login: builder.mutation<Response<Session>, { username: string; password: string }>({
      invalidatesTags: ['session'],
      query: ({ username, password }) => ({
        method: HTTP_METHOD.GET,
        url: '/login',
        headers: {
          Authorization: BrowserUtils.createBasicAuth(username, password),
        },
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        const {
          data: { data },
        } = await queryFulfilled;

        dispatch({
          type: UPDATE_SESSION,
          payload: data,
        });
      },
    }),
    register: builder.mutation<void, { username: string; password: string; fullName: string }>({
      query: (params) => ({
        method: HTTP_METHOD.POST,
        url: '/register',
        data: params,
      }),
    }),
    refreshSession: builder.query<Response<Session>, void>({
      providesTags: ['session'],
      query: () => ({
        method: HTTP_METHOD.GET,
        url: '/session',
      }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        const {
          data: { data },
        } = await queryFulfilled;

        dispatch({
          type: UPDATE_SESSION,
          payload: data,
        });
      },
    }),
    logout: builder.mutation<void, void>({
      invalidatesTags: ['session'],
      query: () => ({
        method: HTTP_METHOD.DELETE,
        url: '/logout',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshSessionQuery, useRegisterMutation } = sessionApi;
