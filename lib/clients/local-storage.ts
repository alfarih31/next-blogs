import { encodeString, decodeString } from './crypto';

const isServer = () => typeof window === 'undefined';

type TOpts = {
  expires: number;
  path: string;
};

const jsonParseData = (s: string): { opts?: TOpts; value: unknown } => JSON.parse(s);

export default class LocalStorage {
  _encode = false;

  constructor(args: { encode: boolean } = { encode: false }) {
    if (args.encode) {
      this._encode = args.encode;
    }
  }

  setItem(key: string, value: unknown, opts: TOpts = { expires: 0, path: '/' }) {
    if (isServer()) {
      return;
    }

    const data = {
      opts,
      value,
    };

    if (this._encode) {
      localStorage.setItem(key, encodeString(JSON.stringify(data)));
      return;
    }

    localStorage.setItem(key, JSON.stringify(data));
  }

  getItem(key: string): unknown | undefined {
    if (isServer()) {
      return;
    }

    let dataStr = localStorage.getItem(key);
    if (!dataStr) {
      return;
    }

    if (this._encode) {
      dataStr = decodeString(dataStr);
    }

    try {
      const data = jsonParseData(dataStr);

      if (!data.opts) {
        return data.value;
      }

      if (data.opts.path !== '/' && data.opts.path !== window.location.pathname) {
        return;
      }

      if (data.opts.expires) {
        const now = Math.round(new Date().getTime() / 1000);

        if (now > data.opts.expires) {
          localStorage.removeItem(key);
          return;
        }
      }

      return data.value;
    } catch (err) {
      return dataStr;
    }
  }
}
