import { NextApiRequest } from 'next';
import { HTTP_METHOD } from '$clients/http-client';
import { withApiHandlerMiddleware } from '$lib/servers/middlewares';
import { APIRequest, APIResponse } from '$dto/api';
import { prismaClient } from '$servers/prisma-client';

const handler = async (req: NextApiRequest): Promise<APIResponse.ListPublicBlogResponse['data']> => {
  const { page, rowsPerPage } = APIRequest.paginationSchema.parse(req.query);

  const skip = page * rowsPerPage;
  const take = page * rowsPerPage + rowsPerPage;

  const totalRows = await prismaClient.blog.count();
  const blogs = await prismaClient.blog.findMany({
    skip,
    take,
    include: {
      owner: true,
    },
  });

  return {
    rows: blogs.map((b) => ({
      name: b.name,
      slug: b.slug,
      authorName: b.owner.fullName,
      createdAt: b.createdAt.toISOString(),
    })),
    totalRows,
  };
};
export default withApiHandlerMiddleware([HTTP_METHOD.GET], handler);
