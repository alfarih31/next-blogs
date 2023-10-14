/* eslint-disable import/no-extraneous-dependencies */
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IncomingMessage } from 'http';
import dotenv from 'dotenv';
import next from 'next';
import path from 'path';
import pathAliases from '$configs/path-aliases';
import fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import RoutesGenerator from './routes-generator';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production' && ['true', 'TRUE', '1'].includes(process.env.HMR || 'true');
const pwd = process.cwd();
const port = parseInt(process.env.PORT || '3000', 10);

const serviceWorkers = [
  {
    filename: 'service-worker.js',
    path: './.next/service-worker.js',
  },
];

const server = fastify();
server.addContentTypeParser('application/json', async (_: FastifyRequest, payload: IncomingMessage) => payload);
server.addContentTypeParser('text/plain', async (_: FastifyRequest, payload: IncomingMessage) => payload);

const app = next({ dev });

// Serve Public
server.register(FastifyStatic, { root: path.join(pwd, 'public') });

app
  .prepare()
  .then(() => {
    serviceWorkers.forEach(({ filename, path: filePath }) => {
      server.get(`/${filename}`, async (req: FastifyRequest, res: FastifyReply) =>
        res.sendFile(filename, path.join(pwd, filePath))
      );
    });

    const routesGenerator = new RoutesGenerator({ server, app, options: { pathAliases } });
    routesGenerator.initPages();

    return server.listen({port});
  })
  .then(() => {
    console.log(`> Ready on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
