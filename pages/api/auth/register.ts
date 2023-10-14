import { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$lib/clients/http-client';
import { prismaClient } from '$servers/prisma-client';
import { genSalt, hash } from 'bcrypt';
import { authConfig } from '$configs/auth.config';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, fullName } = req.body;
  const salt = await genSalt(authConfig.BCRYPT_SALT_ROUNDS);
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

  res.status(200).json({ message: 'OK' });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method?.toUpperCase()) {
    case HTTP_METHOD.POST:
      return post(req, res);
    default:
      return res.status(404).send('not implemented');
  }
}
