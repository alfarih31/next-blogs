import type { NextApiHandler } from 'next';
import { HTTP_METHOD } from '$clients/http-client';
import { HttpError } from '$lib/http-error';
import { APIHandler } from '$lib/dto/api';
import { ZodError } from 'zod';
import { HttpStatusCode } from 'axios';

export const withApiHandlerMiddleware =
  (method: HTTP_METHOD[], handler: APIHandler): NextApiHandler =>
  async (req, res) => {
    const reqMethod = req.method?.toUpperCase() || '';
    if (!method.includes(reqMethod as HTTP_METHOD)) {
      return res.status(HttpStatusCode.MethodNotAllowed).json({ message: 'Method not allowed' });
    }

    try {
      const result = await handler(req, res);
      if (res.writableEnded) {
        return;
      }

      if (!result) {
        return res.status(HttpStatusCode.Ok).json({ message: 'OK' });
      }

      return res.status(HttpStatusCode.Ok).json({ message: 'OK', data: result });
    } catch (err) {
      if (res.writableEnded) {
        return;
      }

      if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
      }

      if (err instanceof ZodError) {
        return res.status(HttpStatusCode.BadRequest).json({ message: err.message, details: err.errors });
      }
      return res.status(HttpStatusCode.InternalServerError).json({ message: (err as Error).message });
    }
  };
