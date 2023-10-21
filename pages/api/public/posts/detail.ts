import { NextApiRequest } from 'next';
import { HTTP_METHOD } from '$clients/http-client';
import { withApiHandlerMiddleware } from '$lib/servers/middlewares';
import { APIRequest, APIResponse } from '$dto/api';
import { prismaClient } from '$servers/prisma-client';
import { HttpError } from '$lib/http-error';
import { HttpStatusCode } from 'axios';

const handler = async (req: NextApiRequest): Promise<APIResponse.PublicBlogPostDetailResponse['data']> => {
  const { blogSlug, blogPostSlug } = APIRequest.publicBlogPostDetailRequest.parse(req.query);

  const blog = await prismaClient.blog.findFirst({
    where: {
      slug: blogSlug,
    },
    include: {
      owner: true,
    },
  });
  if (!blog) {
    throw new HttpError('', 'Blog not found', HttpStatusCode.NotFound);
  }

  const blogPost = await prismaClient.blogPost.findFirst({
    where: {
      blogId: blog.id,
      slug: blogPostSlug,
    },
    include: {
      sections: true,
    },
  });

  if (!blogPost) {
    throw new HttpError('', 'Blog post not found', HttpStatusCode.NotFound);
  }

  return {
    blog: { authorName: blog.owner.fullName, name: blog.name },
    createdAt: blogPost.createdAt.toISOString(),
    sections: blogPost.sections.map((s) => s.content),
    slug: blogPostSlug,
    title: blogPost.title,
  };
};

export default withApiHandlerMiddleware([HTTP_METHOD.GET], handler);
