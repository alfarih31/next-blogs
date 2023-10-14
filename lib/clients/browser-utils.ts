import path from 'path';
import { IncomingMessage } from 'http';

export default class BrowserUtils {
  static absoluteUrl(
    req: IncomingMessage | undefined,
    localhostAddress = `localhost:${process.env.PORT}`
  ): { protocol: string; host: string; referer: string; origin: string; pathname: string } {
    if (!req) {
      const { location } = document;
      return {
        protocol: location.protocol,
        host: location.host,
        referer: location.href,
        origin: location.origin,
        pathname: location.pathname,
      };
    }
    const referer = (req.headers ? req.headers.referer : window.location.href) || localhostAddress;
    let host = (req.headers ? req.headers.host : window.location.host) || localhostAddress;
    let protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:';

    if (req && req.headers['x-forwarded-host'] && typeof req.headers['x-forwarded-host'] === 'string') {
      host = req.headers['x-forwarded-host'];
    }

    if (req && req.headers['x-forwarded-proto'] && typeof req.headers['x-forwarded-proto'] === 'string') {
      protocol = `${req.headers['x-forwarded-proto']}:`;
    }

    const pathname = req.url?.split('?')[0];
    return {
      protocol,
      host,
      referer,
      origin: `${protocol}//${host}`,
      pathname: pathname || '/',
    };
  }

  static resolveAssetURL(baseURL: string, assetPath: string): string {
    if (!assetPath) {
      return '';
    }

    // eslint-disable-next-line no-param-reassign
    assetPath = decodeURIComponent(assetPath);
    let assetURL;
    try {
      assetURL = new URL(assetPath);
      assetURL.pathname = encodeURI(assetURL.pathname);
      return assetURL.toString();
    } catch (err) {
      assetURL = new URL(baseURL);
    }

    assetURL.pathname = encodeURI(path.join(assetURL.pathname, assetPath));

    return assetURL.toString();
  }

  static extractBasicAuth(s: string): { username: string; password: string } {
    const tmp = s.split('Basic ');
    if (tmp.length !== 2) {
      throw new Error('Invalid Basic Auth');
    }

    const basicAuth = Buffer.from(tmp[1], 'base64').toString();

    const [username, password] = basicAuth.split(':');
    return { username, password };
  }

  static createBasicAuth(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`, 'utf-8').toString('base64')}`;
  }

  static extractBearerToken(s: string): string {
    if (!s) {
      return '';
    }

    const sArr = s.split('Bearer ');
    if (sArr.length < 2) {
      return '';
    }

    return sArr[1];
  }

  static async getMediasLength(data: string[] = []): Promise<number[]> {
    return Promise.all(data.map(async (d) => BrowserUtils.getMediaLength(d)));
  }

  static async getMediaLength(data: string): Promise<number> {
    if (typeof window === 'undefined') {
      return 0;
    }

    try {
      const au = document.createElement('audio');
      au.src = data;

      return await new Promise((resolve) => {
        au.onloadedmetadata = () => {
          resolve(au.duration);
        };
        au.onerror = () => {
          console.error(`this media not found ${data}`);
          resolve(0);
        };
      });
    } catch (e) {
      console.error(`this media not found ${data}`);
      return 0;
    }
  }
}
