import { createApi } from '@reduxjs/toolkit/query/react';
import HTTPClient, { HTTP_METHOD } from '$clients/http-client';
import { PutBlobResult } from '@vercel/blob';
import { HandleUploadBody, upload } from '@vercel/blob/client';
import { APIRequest, APIResponse } from '$dto/api';

export const blogApi = createApi({
  baseQuery: new HTTPClient({ basePath: '/api/blogs' }).toQueryClient(),
  reducerPath: 'blogApi',
  tagTypes: ['blogs', 'blogPosts'],
  endpoints: (builder) => ({
    listBlogPosts: builder.query<APIResponse.ListBlogPostResponse, APIRequest.ListBlogPostRequest>({
      providesTags: ['blogPosts'],
      query: (params) => ({
        method: HTTP_METHOD.GET,
        url: '/posts',
        params,
      }),
    }),
    createBlogPost: builder.mutation<void, APIRequest.CreatePostRequest>({
      invalidatesTags: ['blogPosts'],
      query: (params) => ({
        method: HTTP_METHOD.POST,
        url: '/posts',
        data: params,
      }),
    }),
    uploadAttachment: builder.mutation<{ blob: PutBlobResult; attachmentId: number }, { blogId: number; file: File }>({
      queryFn: async ({ blogId, file }, a, b, baseQuery) => {
        try {
          const blob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/blogs/attachments/upload',
          });

          const callbackPayload: Extract<HandleUploadBody, { type: 'blob.upload-completed' }> = {
            type: 'blob.upload-completed',
            payload: {
              blob,
              tokenPayload: JSON.stringify({
                blogId,
              }),
            },
          };
          const { data, error } = await baseQuery({
            url: '/attachments/upload',
            method: HTTP_METHOD.POST,
            data: callbackPayload,
            headers: {
              'content-type': 'text/plain;charset=UTF-8',
            },
          });

          if (error) {
            return {
              error,
            };
          }

          const responseBody = data! as APIResponse.UploadCallbackResponse;
          return {
            data: {
              attachmentId: responseBody.data.attachmentId,
              blob,
            },
          };
        } catch (err) {
          return {
            error: err,
          };
        }
      },
    }),
    listBlog: builder.query<APIResponse.ListBlogResponse, APIRequest.ListBlogRequest>({
      providesTags: ['blogs'],
      query: (params) => ({
        method: HTTP_METHOD.GET,
        url: '/',
        params,
      }),
    }),
    createBlog: builder.mutation<void, { name: string }>({
      invalidatesTags: ['blogs'],
      query: (params) => ({
        method: HTTP_METHOD.POST,
        url: '/',
        data: params,
      }),
    }),
  }),
});

export const {
  useListBlogQuery,
  useCreateBlogMutation,
  useUploadAttachmentMutation,
  useCreateBlogPostMutation,
  useListBlogPostsQuery,
} = blogApi;
