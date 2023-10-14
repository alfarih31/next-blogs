import { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$clients/http-client';
import { withApiHandlerMiddleware, withSessionMiddleware } from '$servers/middlewares';
import { prismaClient } from '$servers/prisma-client';
import slugify from 'slugify';
import { APIRequest } from '$dto/api';
import { HttpError } from '$lib/http-error';
import { HttpStatusCode } from 'axios';

const get = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { rowsPerPage, page } = await APIRequest.listBlogRequestSchema.parseAsync(req.query);

  const skip = page * rowsPerPage;
  const take = page * rowsPerPage + rowsPerPage;
  const where = {
    ownerId: session.userID,
  };

  const totalRows = await prismaClient.blog.count({ where });
  const blogs = await prismaClient.blog.findMany({
    where,
    skip,
    take,
  });

  return { rows: blogs, totalRows };
};

const post = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { name } = req.body as APIRequest.CreateBlogRequest;

  await prismaClient.blog.create({
    data: {
      ownerId: session.userID,
      name,
      slug: slugify(name, { lower: true }),
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
