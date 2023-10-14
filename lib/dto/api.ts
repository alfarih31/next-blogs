import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';

export type APIHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>;

export namespace APIResponse {
  type PaginatedResponse<T, M = Record<string, unknown>> = {
    rows: T[];
    totalRows: number;
    metadata?: M;
  };

  export type UploadCallbackResponse = ResponseBody<{
    attachmentId: number;
  }>;

  export type ListBlogResponse = ResponseBody<
    PaginatedResponse<{
      id: number;
      name: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
    }>
  >;

  export type ListBlogPostResponse = ResponseBody<
    PaginatedResponse<{
      id: number;
      title: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
      blog: {
        slug: string;
      };
    }>
  >;

  export type ListPublicBlogResponse = ResponseBody<
    PaginatedResponse<{
      name: string;
      slug: string;
      authorName: string;
      createdAt: string;
    }>
  >;

  export type ListPublicBlogPostResponse = ResponseBody<
    PaginatedResponse<
      {
        title: string;
        slug: string;
        createdAt: string;
      },
      { blog: { name: string; slug: string; authorName: string; createdAt: string } }
    >
  >;

  export type PublicBlogPostDetailResponse = ResponseBody<{
    title: string;
    slug: string;
    createdAt: string;
    sections: string[];
    blog: {
      name: string;
      authorName: string;
    };
  }>;
}

export namespace APIRequest {
  export const paginationSchema = z.object({
    page: z.coerce.number().default(0),
    rowsPerPage: z.coerce.number().default(10),
  });

  export type PaginationRequest<T> = z.infer<typeof paginationSchema> & {
    filter: T;
  };

  export type CreateBlogRequest = {
    name: string;
  };

  export type CreatePostRequest = {
    blogId: number;
    title: string;
    sections: string[];
  };

  export const listBlogRequestSchema = paginationSchema;
  export type ListBlogRequest = z.infer<typeof listBlogRequestSchema>;

  export const listBlogPostRequestSchema = z.intersection(
    paginationSchema,
    z.object({
      blogId: z.coerce.number(),
    })
  );
  export type ListBlogPostRequest = z.infer<typeof listBlogPostRequestSchema>;

  export const listPublicBlogPostRequestSchema = z.intersection(
    paginationSchema,
    z.object({
      blogSlug: z.string().min(3),
    })
  );
  export type ListPublicBlogPostRequest = z.infer<typeof listPublicBlogPostRequestSchema>;

  export const publicBlogPostDetailRequest = z.object({
    blogSlug: z.string().min(3),
    blogPostSlug: z.string().min(3),
  });
  export type PublicBlogPostDetailRequest = z.infer<typeof publicBlogPostDetailRequest>;

  export const deleteBlogRequestSchema = z.object({
    blogId: z.coerce.number(),
  });
  export type DeleteBlogRequest = z.infer<typeof deleteBlogRequestSchema>;
}
