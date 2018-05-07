// @flow
import { pkcs5, random } from 'node-forge';

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

export default class Crypto {
  /**
   * From a user password, pbkdf2 three private strings and return params
   * @param {string} password - user inputted password
   */
  static derivePassword(password: string | Buffer) {
    const salt = random.getBytesSync(128);
    return new Promise((resolve, reject) => {
      pkcs5.pbkdf2(
        password,
        salt,
        DEFAULT_ITERATIONS,
        DEFAULT_KEYLEN,
        DEFAULT_DIGEST,
        (err, derivedKey: string) => {
          if (err) {
            reject(err);
          } else {
            const keylenThird = DEFAULT_KEYLEN / 3;
            const result: DerivePasswordResult = {
              pw: derivedKey.slice(0, keylenThird),
              mk: derivedKey.slice(keylenThird, keylenThird * 2),
              ak: derivedKey.slice(keylenThird * 2, DEFAULT_KEYLEN),
              pwSalt: salt,
              pwCost: DEFAULT_ITERATIONS,
              pwKeySize: DEFAULT_KEYLEN,
              pwDigest: DEFAULT_DIGEST,
              pwFunc: 'pbkdf2',
            };
            resolve(result);
          }
        },
      );
    });
  }
}
