import { NextApiRequest } from 'next';
import { HTTP_METHOD } from '$lib/clients/http-client';
import { prismaClient } from '$servers/prisma-client';
import { genSalt, hash } from 'bcrypt';
import { authServerConfig } from '$configs/servers/auth.server.config';
import { withApiHandlerMiddleware } from '$servers/middlewares';

const post = async (req: NextApiRequest) => {
  const { username, password, fullName } = req.body;
  const salt = await genSalt(authServerConfig.BCRYPT_SALT_ROUNDS);
  const passwordHash = await hash(password, salt);
  await prismaClient.user.create({
    data: {
      fullName,
      userAuths: {
        create: {
          username,
          credentials: passwordHash,
        },
      },
    },
  });
};

export default withApiHandlerMiddleware([HTTP_METHOD.POST], post);
