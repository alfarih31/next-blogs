import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$lib/clients/http-client';
import { COOKIES_KEY } from '$lib/CONSTANTS';
import ServerCookies from '$lib/servers/server-cookies';
import KeyGrip from '$lib/servers/key-grip';
import { appServerConfig } from '$configs/servers/app.server.config';
import { withApiHandlerMiddleware } from '$servers/middlewares';

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = new ServerCookies(req, res, { encrypt: true, keys: new KeyGrip(appServerConfig.ENCRYPT_SECRET) });

  cookie.deleteValues(COOKIES_KEY.SESSION);
};

export default withApiHandlerMiddleware([HTTP_METHOD.DELETE], del);
