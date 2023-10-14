import { createApi } from '@reduxjs/toolkit/query/react';
import HTTPClient, { HTTP_METHOD } from '$clients/http-client';
import { APIRequest, APIResponse } from '$dto/api';

export const publicApi = createApi({
  baseQuery: new HTTPClient({ basePath: '/api/public' }).toQueryClient(),
  reducerPath: 'publicApi',
  tagTypes: ['publicBlogs', 'pubicBlogPosts', 'publicBlogPostDetail'],
  endpoints: (builder) => ({
    publicBlogPostDetail: builder.query<
      APIResponse.PublicBlogPostDetailResponse,
      APIRequest.PublicBlogPostDetailRequest
    >({
      providesTags: (result, error, arg) => [
        { type: 'publicBlogPostDetail', id: `${arg.blogSlug}/${arg.blogPostSlug}` },
      ],
      query: (params) => ({
        method: HTTP_METHOD.GET,
        url: '/posts/detail',
        params,
      }),
    }),
    listPublicBlogPosts: builder.query<APIResponse.ListPublicBlogPostResponse, APIRequest.ListPublicBlogPostRequest>({
      providesTags: (result, error, arg) => [
        { type: 'pubicBlogPosts', id: `${arg.blogSlug}/${arg.page}/${arg.rowsPerPage}` },
      ],
      query: (params) => ({
        method: HTTP_METHOD.GET,
        url: '/posts',
        params,
      }),
    }),
    listPublicBlog: builder.query<APIResponse.ListPublicBlogResponse, APIRequest.ListBlogRequest>({
      providesTags: (result, error, arg) => [{ type: 'publicBlogs', id: `/${arg.page}/${arg.rowsPerPage}` }],
      query: (params) => ({
        method: HTTP_METHOD.GET,
        url: '/blogs',
        params,
      }),
    }),
  }),
});

export const { useListPublicBlogQuery, useListPublicBlogPostsQuery, usePublicBlogPostDetailQuery } = publicApi;
