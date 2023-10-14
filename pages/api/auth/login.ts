import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$lib/clients/http-client';
import { COOKIES_KEY, USER_ROLE } from '$lib/CONSTANTS';
import ServerCookies from '$servers/server-cookies';
import KeyGrip from '$servers/key-grip';
import BrowserUtils from '$clients/browser-utils';
import { enums, prismaClient } from '$servers/prisma-client';
import { compare } from 'bcrypt';
import { appServerConfig } from '$configs/servers/app.server.config';
import { withApiHandlerMiddleware } from '$servers/middlewares';
import { HttpError } from '$lib/http-error';
import { HttpStatusCode } from 'axios';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = BrowserUtils.extractBasicAuth(req.headers.authorization || '');

  const userAuth = await prismaClient.userAuth.findFirst({ where: { username } });
  if (userAuth === null) {
    throw new HttpError('', 'invalid credentials', HttpStatusCode.Unauthorized);
  }

  if (userAuth.authProvider !== enums.AuthProvider.BASIC) {
    throw new HttpError('', 'invalid credentials', HttpStatusCode.Unauthorized);
  }

  const isMatch = await compare(password, userAuth.credentials);
  if (!isMatch) {
    throw new HttpError('', 'invalid credentials', HttpStatusCode.Unauthorized);
  }

  const cookie = new ServerCookies(req, res, { encrypt: true, keys: new KeyGrip(appServerConfig.ENCRYPT_SECRET) });

  const payload: Session = { authenticated: true, role: USER_ROLE.PERSONAL, userID: userAuth.userId };
  cookie.setValue(COOKIES_KEY.SESSION, JSON.stringify(payload));
};

export default withApiHandlerMiddleware([HTTP_METHOD.GET], get);
