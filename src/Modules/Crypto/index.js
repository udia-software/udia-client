// @flow
import { Buffer } from 'buffer/'; // not a typo, using buffer browser polyfill

/**
 * These are options that we receive from the server.
 */
type DerivePasswordOptions = {
  password: string,
  pwSalt?: string,
  pwCost?: number,
  pwKeySize?: number,
  pwDigest?: string,
  pwFunc?: string,
};

/**
 * These are the derived values
 */
type DerivePasswordResult = {
  pw: string, // Proof of secret, derived from user password. Send to server
  mk: string, // Do not send to server
  ak: string, // Do not send to server
  pwSalt: string,
  pwCost: number,
  pwKeySize: number,
  pwDigest: string,
  pwFunc: string,
};

const DEFAULT_ITERATIONS = 100000;
const DEFAULT_KEYLEN = 768; // 768 bytes, generates 3 arraybuffers of size 256 bytes each
const DEFAULT_DIGEST = 'SHA-512';
const DEFAULT_PWFUNC = 'PBKDF2';

export default class Crypto {
  static validateUserInputtedPassword(password: string) {
    const bufferedPassword = Buffer.from(password, 'utf8');
    const errors: string[] = [];
    if (bufferedPassword.length < 8) {
      errors.push('Master password must be 8 or more characters.');
    }
    return errors;
  }

  static getRandomCharacters(length: number = 128) {
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return randomValues;
  }

  static derivePassword(options: DerivePasswordOptions) {
    const {
      password,
      pwSalt,
      pwCost = DEFAULT_ITERATIONS,
      pwKeySize = DEFAULT_KEYLEN,
      pwDigest = DEFAULT_DIGEST,
      pwFunc = DEFAULT_PWFUNC,
    } = options;

    if (pwFunc !== DEFAULT_PWFUNC) {
      throw new Error(`Unsupported key derivation function '${pwFunc}', only PBKDF2 support`);
    }

    if (pwKeySize % 3 !== 0) {
      throw new Error(`Derived bytes length must be multiple of 3, received ${pwKeySize}`);
    }

    const sepPw = pwKeySize / 3;
    const sepMk = sepPw * 2;

    const passwordBuffer = Buffer.from(password, 'utf8');
    let saltBuffer = Buffer.from(Crypto.getRandomCharacters());
    if (pwSalt) {
      saltBuffer = Buffer.from(pwSalt, 'base64');
    }

    return window.crypto.subtle
      .importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveBits'])
      .then(cryptoKey =>
        window.crypto.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: pwCost,
            hash: pwDigest,
          },
          cryptoKey,
          pwKeySize * 8, // 8 bits in a byte
        ))
      .then((buffer: ArrayBuffer) => {
        const keyBuffer = Buffer.from(buffer, 'utf8');
        const output: DerivePasswordResult = {
          pw: keyBuffer.slice(0, sepPw).toString('base64'),
          mk: keyBuffer.slice(sepPw, sepMk).toString('base64'),
          ak: keyBuffer.slice(sepMk, pwKeySize).toString('base64'),
          pwSalt: Buffer.from(saltBuffer).toString('base64'),
          pwCost,
          pwKeySize,
          pwDigest,
          pwFunc,
        };
        return output;
      });
  }
}
