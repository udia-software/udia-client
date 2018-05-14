// @flow
import { pkcs5, random } from 'node-forge';

type DerivePasswordOptions = {
  password: string | Buffer,
  pwSalt?: string,
  pwCost?: number,
  pwKeySize?: number,
  pwDigest?: string,
  pwFunc?: string,
};

type DerivePasswordResult = {
  pw: string,
  mk: string,
  ak: string,
  pwSalt: string,
  pwCost: number,
  pwKeySize: number,
  pwDigest: string,
  pwFunc: string,
};

const DEFAULT_ITERATIONS = 3001;
const DEFAULT_KEYLEN = 768;
const DEFAULT_DIGEST = 'sha512';
const DEFAULT_PWFUNC = 'pbkdf2';

export default class Crypto {
  static validateUserInputtedPassword(password: string) {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Master password must be 8 or more characters.');
    }
    return errors;
  }


  static derivePassword(options: DerivePasswordOptions) {
    const newSalt = random.getBytesSync(128);
    const {
      password,
      pwSalt = newSalt,
      pwCost = DEFAULT_ITERATIONS,
      pwKeySize = DEFAULT_KEYLEN,
      pwDigest = DEFAULT_DIGEST,
      pwFunc = DEFAULT_PWFUNC,
    } = options;
    if (pwFunc !== DEFAULT_PWFUNC) {
      throw new Error(`Invalid password derivation function '${pwFunc}'`);
    }

    return new Promise((resolve, reject) => {
      pkcs5.pbkdf2(password, pwSalt, pwCost, pwKeySize, pwDigest, (err, derivedKey: string) => {
        if (err) {
          reject(err);
        } else {
          const keylenThird = DEFAULT_KEYLEN / 3;
          const result: DerivePasswordResult = {
            pw: derivedKey.slice(0, keylenThird),
            mk: derivedKey.slice(keylenThird, keylenThird * 2),
            ak: derivedKey.slice(keylenThird * 2, DEFAULT_KEYLEN),
            pwSalt,
            pwCost,
            pwKeySize,
            pwDigest,
            pwFunc,
          };
          resolve(result);
        }
      });
    });
  }
}
