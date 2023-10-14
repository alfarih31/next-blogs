import type { BinaryLike, BinaryToTextEncoding } from 'crypto';
import compare from 'tsscmp';
import crypto from 'crypto';

const replacer: { [key: string]: string } = { '/': '_', '+': '-', '=': '' };

export default class KeyGrip {
  keys: string | string[];

  algorithm;

  encoding: BinaryToTextEncoding;

  constructor(keys: string | string[], algorithm = 'sha1', encoding: BinaryToTextEncoding = 'base64') {
    this.keys = keys;
    this.algorithm = algorithm;
    this.encoding = encoding;

    if (!keys) {
      throw new Error('Keys must be provided.');
    }

    if (Array.isArray(keys) && !keys.length) {
      throw new Error('Keys must be provided.');
    }
  }

  private _sign(data: BinaryLike, key: string): string {
    return crypto
      .createHmac(this.algorithm, key)
      .update(data)
      .digest(this.encoding)
      .replace(/\/|\+|=/g, (x: string): string => replacer[x]);
  }

  sign(data: BinaryLike): string {
    if (Array.isArray(this.keys)) {
      this.keys.every((k) => {
        if (!k) {
          return true;
        }

        return this._sign(data, k);
      });
    }

    return this._sign(data, this.keys as string);
  }

  index(data: BinaryLike, digest: string): number {
    for (let i = 0, l = this.keys.length; i < l; i += 1) {
      const k = this.keys[i];
      if (!k) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (compare(digest, this._sign(data, k))) {
        return i;
      }
    }

    return -1;
  }

  verify(data: BinaryLike, digest: string) {
    return this.index(data, digest) > -1;
  }
}
