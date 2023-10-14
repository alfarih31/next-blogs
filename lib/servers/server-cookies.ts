import type { IncomingMessage, ServerResponse } from 'http';
import type { GetOption, SetOption } from 'cookies';
import Cookies from 'cookies';
import KeyGrip from './key-grip';
import { encryptString, decryptString } from './crypto';

type TOpts = {
  encrypt: boolean;
  keys?: KeyGrip;
};

export default class ServerCookies extends Cookies {
  _encrypt = false;

  constructor(req: IncomingMessage, res: ServerResponse, opts: TOpts = { encrypt: false, keys: undefined }) {
    super(req, res, opts);

    if (opts) {
      if (opts.encrypt) {
        this._encrypt = opts.encrypt;
      }
    }
  }

  getValue(name: string, opts?: GetOption) {
    const value = super.get(name, opts);

    if (!value) {
      return value;
    }

    if (this._encrypt) {
      return decryptString(value);
    }

    return value;
  }

  setValue(name: string, value: string, opts?: SetOption) {
    if (!value) {
      return;
    }

    if (this._encrypt) {
      return super.set(name, encryptString(value), { ...opts });
    }

    return super.set(name, value, { ...opts });
  }

  deleteValues(...names: string[]) {
    names.forEach((name) => {
      super.set(name, undefined, { overwrite: true, expires: new Date(0) });
    });
  }
}
