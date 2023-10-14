import { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$clients/http-client';
import { withApiHandlerMiddleware, withSessionMiddleware } from '$servers/middlewares';
import { enums, prismaClient } from '$servers/prisma-client';
import slugify from 'slugify';
import { APIRequest } from '$dto/api';
import { HttpError } from '$lib/http-error';
import { HttpStatusCode } from 'axios';

const isBlogOwned = async (blogId: number, ownerId: number): Promise<boolean> => {
  const blog = await prismaClient.blog.findFirst({
    where: {
      id: blogId,
      ownerId,
    },
  });

  return !!blog;
};

const get = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { rowsPerPage, page, blogId } = await APIRequest.listBlogPostRequestSchema.parseAsync(req.query);

  // Validate blog is owned
  if (!(await isBlogOwned(blogId, session.userID))) {
    throw new HttpError('', 'blog not owned', HttpStatusCode.BadRequest);
  }

  const skip = page * rowsPerPage;
  const take = page * rowsPerPage + rowsPerPage;
  const where = {
    blogId,
  };

  const totalRows = await prismaClient.blogPost.count({ where });
  const blogs = await prismaClient.blogPost.findMany({
    where,
    skip,
    take,
    include: {
      blog: true,
    },
  });

  return { rows: blogs, totalRows };
};

const post = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { blogId, title, sections } = req.body as APIRequest.CreatePostRequest;

  // Validate blog is owned
  if (!(await isBlogOwned(blogId, session.userID))) {
    throw new HttpError('', 'blog not owned', HttpStatusCode.BadRequest);
  }

  let sluggifiedTitle = slugify(title, { lower: true });
  sluggifiedTitle = sluggifiedTitle.slice(0, 255);
  await prismaClient.blogPost.create({
    data: {
      blogId,
      title,
      slug: sluggifiedTitle,
      status: enums.BlogPostStatus.PUBLISHED,
      sections: {
        create: sections.map((section) => ({
          content: section,
        })),
      },
    },
  });
};

async function handler(req: NextApiRequest, res: NextApiResponse, session: Session) {
  switch (req.method?.toUpperCase()) {
    case HTTP_METHOD.GET:
      return get(req, res, session);
    case HTTP_METHOD.POST:
      return post(req, res, session);
    default:
      throw new HttpError('', 'method not allowed', HttpStatusCode.MethodNotAllowed);
  }
}

export default withApiHandlerMiddleware([HTTP_METHOD.GET, HTTP_METHOD.POST], withSessionMiddleware(handler));
