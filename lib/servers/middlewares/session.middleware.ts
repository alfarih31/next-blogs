import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionFromRequest } from '$servers/session';
import { HttpError } from '$lib/http-error';
import { HttpStatusCode } from 'axios';

export function withSessionMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse, session: Session) => Promise<unknown>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = getSessionFromRequest(req, res);
      if (!session.authenticated) {
        throw new Error('unauthenticated');
      }
      return await handler(req, res, session);
    } catch (err: unknown) {
      throw new HttpError('', (err as Error).message, HttpStatusCode.Unauthorized);
    }
  };
}
