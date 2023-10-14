import type { IncomingMessage, ServerResponse } from 'http';
import ServerCookies from '$servers/server-cookies';
import KeyGrip from '$servers/key-grip';
import { COOKIES_KEY } from '$lib/CONSTANTS';

export const getSessionFromRequest = (req: IncomingMessage, res: ServerResponse): Session => {
  const cookie = new ServerCookies(req, res, { encrypt: true, keys: new KeyGrip(process.env.ENCRYPT_SECRET || '') });

  const session: Session = { authenticated: false, role: 0, userID: 0 };
  const sessionStr = cookie.getValue(COOKIES_KEY.SESSION);

  if (sessionStr) {
    Object.assign(session, JSON.parse(sessionStr));
  }
  return session;
};
