import { NextApiRequest } from 'next';
import { HTTP_METHOD } from '$clients/http-client';
import { withApiHandlerMiddleware } from '$lib/servers/middlewares';
import { APIRequest, APIResponse } from '$dto/api';
import { prismaClient } from '$servers/prisma-client';
import { HttpError } from '$lib/http-error';
import { HttpStatusCode } from 'axios';

const handler = async (req: NextApiRequest): Promise<APIResponse.ListPublicBlogPostResponse['data']> => {
  const { page, rowsPerPage, blogSlug } = APIRequest.listPublicBlogPostRequestSchema.parse(req.query);

  const skip = page * rowsPerPage;
  const take = page * rowsPerPage + rowsPerPage;

  const blog = await prismaClient.blog.findFirst({
    where: {
      slug: blogSlug,
    },
    include: {
      owner: true,
    },
  });
  if (!blog) {
    throw new HttpError('', 'Blog not found', HttpStatusCode.BadRequest);
  }

  const where = {
    blogId: blog.id,
  };
  const totalRows = await prismaClient.blogPost.count({
    where,
  });
  const blogs = await prismaClient.blogPost.findMany({
    where,
    skip,
    take,
  });

  return {
    rows: blogs.map((b) => ({
      title: b.title,
      slug: b.slug,
      createdAt: b.createdAt.toISOString(),
    })),
    totalRows,
    metadata: {
      blog: {
        name: blog.name,
        authorName: blog.owner.fullName,
        slug: blogSlug,
        createdAt: blog.createdAt.toString(),
      },
    },
  };
};
export default withApiHandlerMiddleware([HTTP_METHOD.GET], handler);
