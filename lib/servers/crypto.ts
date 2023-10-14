import crypto from 'crypto';
import { Buffer } from 'buffer';

const algorithm = 'aes-256-ctr';
const secretKey = Buffer.from(process.env.ENCRYPT_SECRET || '', 'ascii');
const iv = crypto.randomBytes(16);

export const encryptString = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return Buffer.from(
    JSON.stringify({
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
    })
  ).toString('base64');
};

export const decryptString = (hash: string): string => {
  const payload = JSON.parse(Buffer.from(hash, 'base64').toString('ascii'));

  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(payload.iv, 'hex'));

  const decrypted = Buffer.concat([decipher.update(Buffer.from(payload.content, 'hex')), decipher.final()]);

  return decrypted.toString();
};

export const encodeString = (text: string): string => Buffer.from(text).toString('base64');

export const decodeString = (text: string): string => Buffer.from(text, 'base64').toString('ascii');
