import KeyGrip from './servers/key-grip';

type TOpts = {
  expires: Date | undefined;
  path: string;
};

export default class BrowserCookies {
  _encrypt = false;

  keys?: KeyGrip;

  constructor(args: { keys?: KeyGrip; encrypt: boolean } = { keys: undefined, encrypt: false }) {
    if (args) {
      this.keys = args.keys;
      this._encrypt = args.encrypt;
    }
  }

  private static _set(name: string, value: string, opts: TOpts = { expires: undefined, path: '/' }) {
    let expires = '';
    if (opts.expires) {
      expires = `expires=${opts.expires.toUTCString()};`;
    }

    let p = '/;';
    if (opts.path) {
      p = `${opts.path};`;
    }

    document.cookie = `${name}=${value};${expires}${p}`;
  }

  private static _get(name: string): string | undefined {
    name = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        const value = c.substring(name.length, c.length);
        if (value === 'undefined' || value === 'null') return undefined;

        return value;
      }
    }

    return undefined;
  }

  setValue(
    name: string,
    value: string,
    opts: { signed: boolean } & TOpts = { expires: undefined, path: '/', signed: false }
  ) {
    if (!name || !value) {
      return;
    }

    BrowserCookies._set(name, value, opts);

    if (this._encrypt && this.keys && opts.signed) {
      const sigValue = this.keys.sign(value);
      BrowserCookies._set(`${name}.sig`, sigValue, opts);
    }
  }

  getValue(name: string, opts?: { signed: boolean }): string | undefined {
    if (!name) {
      return undefined;
    }

    const value = BrowserCookies._get(name);

    if (this._encrypt && this.keys && opts && opts.signed) {
      const sigValue = BrowserCookies._get(`${name}.sig`);
      if (value && sigValue) {
        if (this.keys.verify(value, sigValue)) {
          return value;
        }
      }

      return undefined;
    }

    return value;
  }

  static deleteValues(...names: string[]) {
    names.forEach((name) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  }
}
