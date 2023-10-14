import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_METHOD } from '$lib/clients/http-client';
import { getSessionFromRequest } from '$servers/session';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return res.status(200).json({ message: 'OK', data: getSessionFromRequest(req, res) });
  } catch (err: unknown) {
    return res.status(401).json({ message: (err as Error).toString() });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method?.toUpperCase()) {
    case HTTP_METHOD.GET:
      return get(req, res);
    default:
      return res.status(404).send('not implemented');
  }
}
