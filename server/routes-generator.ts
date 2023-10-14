/* eslint-disable import/no-extraneous-dependencies */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { PathAlias } from '$dto/config';
import type { NextServer } from 'next/dist/server/next';
import fs from 'fs';
import path from 'path';
import { parse } from 'url';

export default class RoutesGenerator {
  app: NextServer;

  server: FastifyInstance;

  pathAliases: PathAlias[] = [];

  constructor(args: { server: FastifyInstance; app: NextServer; options?: { pathAliases: PathAlias[] } }) {
    this.server = args.server;
    this.app = args.app;
    if (args.options) {
      this.pathAliases = args.options.pathAliases;
    }
  }

  static getListFiles = (p: string): string[] => fs.readdirSync(p);

  static getFileName = (p: string): string => path.parse(p).name;

  static isDir = (p: string): boolean => fs.lstatSync(p).isDirectory();

  static getPages = (basePath: string): string[] => {
    let routes: string[] = [];
    // Get list dir of basePath
    const listFiles = RoutesGenerator.getListFiles(basePath);
    listFiles.forEach((file) => {
      const childPath = path.join(basePath, file);

      routes.push(childPath);

      if (RoutesGenerator.isDir(childPath)) {
        const childRoutes = RoutesGenerator.getPages(childPath);
        routes = routes.concat(childRoutes);
      }
    });

    return routes;
  };

  static generateServerRoutes = (ROOT_PATH: string) => {
    const pages = RoutesGenerator.getPages(ROOT_PATH);

    const serverRoutes: Set<string> = new Set();

    pages.forEach((p) => {
      [, p] = p.split(ROOT_PATH);
      if (p.startsWith('/api')) {
        return;
      }

      const pageFrac = p.split('/');
      if (pageFrac[pageFrac.length - 1].startsWith('_')) {
        return;
      }

      const serverRouteFrac: string[] = [];
      pageFrac.forEach((pf) => {
        let r = pf;
        if (pf.startsWith('[')) {
          r = `:${r.split('[')[1].split(']')[0]}`;
        }

        r = RoutesGenerator.getFileName(r);
        if (r === 'index') {
          return;
        }
        serverRouteFrac.push(r);
      });

      const route = serverRouteFrac.join('/');
      serverRoutes.add(route);
    });

    return Array.from(serverRoutes)
      .sort((a, b) => a.split('/').length - b.split('/').length)
      .reverse()
      .map((i) => {
        if (!i) {
          return '/';
        }

        return i;
      });
  };

  static parsePathAliasParams = (aliasedUrl: string, requestedUrl: string) => {
    const aliasedFrac = aliasedUrl.split('/');
    const requestedFrac = requestedUrl.split('/');

    if (aliasedFrac.length !== requestedFrac.length) {
      throw new Error('Requested URL path fraction not similar to Aliased Url ');
    }

    aliasedFrac.forEach((f, index) => {
      if (f.startsWith(':')) {
        aliasedFrac[index] = requestedFrac[index];
      }
    });

    return aliasedFrac.join('/');
  };

  initPages = (pagesPath = 'pages') => {
    const handle = this.app.getRequestHandler();
    const routes = RoutesGenerator.generateServerRoutes(pagesPath);

    // Next static
    this.server.get('/_next/*', (req: FastifyRequest, res: FastifyReply) =>
      handle(req.raw, res.raw).then(() => {
        res.hijack();
      })
    );

    // Init pages routes
    routes.forEach((r) => {
      this.server.get(r, (req: FastifyRequest, res: FastifyReply) => {
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        return this.app.render(req.raw, res.raw, pathname || '/', { ...query, ...(req.params as object) }).then(() => {
          res.hijack();
        });
      });
    });

    // Init path aliases
    if (Array.isArray(this.pathAliases)) {
      this.pathAliases.forEach((alias) => {
        const { from, to } = alias;

        this.server.get(from, (req, res) => {
          const targetUrl = RoutesGenerator.parsePathAliasParams(to, req.url);

          const parsedUrl = parse(targetUrl, true);
          const { pathname, query } = parsedUrl;

          return this.app.render(req.raw, res.raw, pathname || '/', { ...query, ...(req.query as object) }).then(() => {
            res.hijack();
          });
        });
      });
    }

    // Init API routes
    this.server.all('/api/*', (req: FastifyRequest, res: FastifyReply) => {
      const parsedUrl = parse(req.url, true);
      return handle(req.raw, res.raw, parsedUrl).then(() => {
        res.hijack();
      });
    });

    this.server.setNotFoundHandler((req: FastifyRequest, res: FastifyReply) =>
      this.app.render404(req.raw, res.raw).then(() => {
        res.hijack();
      })
    );
  };
}
