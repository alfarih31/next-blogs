import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$lib/clients/http-client';
import { COOKIES_KEY, USER_ROLE } from '$lib/CONSTANTS';
import ServerCookies from '$servers/server-cookies';
import KeyGrip from '$servers/key-grip';
import BrowserUtils from '$clients/browser-utils';
import { enums, prismaClient } from '$servers/prisma-client';
import { compare } from 'bcrypt';
import { appConfig } from '$configs/app.config';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = BrowserUtils.extractBasicAuth(req.headers.authorization || '');

  const userAuth = await prismaClient.userAuth.findFirst({ where: { username } });
  if (userAuth === null) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  if (userAuth.authProvider !== enums.AuthProvider.BASIC) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const isMatch = await compare(password, userAuth.credentials);
  if (!isMatch) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const cookie = new ServerCookies(req, res, { encrypt: true, keys: new KeyGrip(appConfig.ENCRYPT_SECRET) });

  cookie.setValue(COOKIES_KEY.USER_TOKEN, Buffer.from(username + password).toString('base64'), {
    expires: new Date(new Date().getTime() + 300000),
  });

  const payload: Session = { authenticated: true, role: USER_ROLE.PERSONAL, userID: userAuth.userId };
  cookie.setValue(COOKIES_KEY.SESSION, JSON.stringify(payload));
  res.status(200).json({ message: 'OK', data: payload });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method?.toUpperCase()) {
    case HTTP_METHOD.GET:
      return get(req, res);
    default:
      return res.status(404).send('not implemented');
  }
}
