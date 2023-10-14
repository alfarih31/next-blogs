import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$lib/clients/http-client';
import { COOKIES_KEY } from '$lib/CONSTANTS';
import ServerCookies from '$lib/servers/server-cookies';
import KeyGrip from '$lib/servers/key-grip';

const _delete = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = new ServerCookies(req, res, { encrypt: true, keys: new KeyGrip(process.env.ENCRYPT_SECRET || '') });

  cookie.deleteValues(COOKIES_KEY.USER_TOKEN, COOKIES_KEY.SESSION);

  res.status(200).json({ message: 'OK' });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method?.toUpperCase()) {
    case HTTP_METHOD.DELETE:
      return _delete(req, res);
    default:
      return res.status(404).send('not implemented');
  }
}
