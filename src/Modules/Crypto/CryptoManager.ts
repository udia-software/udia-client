import { Buffer } from "buffer";

interface ISafariCrypto extends Crypto {
  webkitSubtle?: SubtleCrypto;
}
interface ICryptoWindow extends Window {
  msCrypto?: Crypto;
  crypto: Crypto | ISafariCrypto;
}
declare var window: ICryptoWindow;

interface IDerivePasswordOptions {
  userInputtedPassword: string; // raw user password (utf8 encoded string)
  pwSalt?: string; // optional salt from getAuthParams (base64 encoded string)
  pwCost?: number; // number of iterations
  pwKeySize?: number; // derived key buffer size
  pwDigest?: string; // webcrypto digest function to use
  pwFunc?: string; // webcrypto password derivation function to use
}

interface IMasterKeyBuffers {
  pw: Buffer;
  mk: Buffer;
  ak: Buffer;
  pwSalt: Buffer;
  pwCost: number;
  pwKeySize: number;
  pwDigest: string;
  pwFunc: string;
}

/**
 * Collection of helper methods for encryption in accordance with the UDIA API specification
 */
export default class CryptoManager {
  private static DEFAULT_ITERATIONS = 100000;
  private static DEFAULT_KEYLEN = 768;
  private static DEFAULT_DIGEST = "SHA-512";
  private static DEFAULT_PWFUNC = "PBKDF2";

  private static isGlobalCrypto(object: any = {}): object is Crypto {
    const isGlobalCrypto = "subtle" in object;
    if (!isGlobalCrypto) {
      // tslint:disable-next-line:no-console
      console.log(object);
    }
    return isGlobalCrypto;
  }

  private static isSubtleCrypto(object: any = {}): object is SubtleCrypto {
    const isSubtleCrypto =
      "decrypt" in object &&
      "deriveKey" in object &&
      "deriveBits" in object &&
      "digest" in object &&
      "encrypt" in object &&
      "exportKey" in object &&
      "generateKey" in object &&
      "importKey" in object &&
      "sign" in object &&
      "unwrapKey" in object &&
      "verify" in object &&
      "wrapKey" in object;
    if (!isSubtleCrypto) {
      // tslint:disable-next-line:no-console
      console.log(object);
    }
    return isSubtleCrypto;
  }

  private globalCrypto: Crypto;
  private subtleCrypto: SubtleCrypto;

  /**
   * CryptoManager instantiation takes care of some common crypto module gotchas
   */
  constructor() {
    // Check Global Crypto
    if (CryptoManager.isGlobalCrypto(window.crypto)) {
      this.globalCrypto = window.crypto;
    } else if (CryptoManager.isGlobalCrypto(window.msCrypto)) {
      this.globalCrypto = window.msCrypto!; // Microsoft IE 11
    } else {
      throw new Error("Global Crypto module does not exist!");
    }

    // Check SubtleCrypto
    if (CryptoManager.isSubtleCrypto(this.globalCrypto.subtle)) {
      this.subtleCrypto = this.globalCrypto.subtle;
    } else {
      const safariCryptoCheck: ISafariCrypto = this.globalCrypto;
      if (CryptoManager.isSubtleCrypto(safariCryptoCheck.webkitSubtle)) {
        this.subtleCrypto = safariCryptoCheck.webkitSubtle!; // Apple Safari
      } else {
        throw new Error("SubtleCrypto module does not exist!");
      }
    }
  }

  public validateUserInputtedPassword(userInputtedPassword: string) {
    const bufferedPassword = Buffer.from(userInputtedPassword, "utf8");
    const errors: string[] = [];
    if (bufferedPassword.length < 8) {
      errors.push("Master password must be 8 or more characters.");
    }
    return errors;
  }

  public getRandomValues(length: number = 128) {
    const randomValues = new Uint8Array(length);
    this.globalCrypto.getRandomValues(randomValues);
    return randomValues;
  }

  public async deriveMasterKeys(
    options: IDerivePasswordOptions
  ): Promise<IMasterKeyBuffers> {
    const {
      userInputtedPassword: uip,
      pwSalt,
      pwCost = CryptoManager.DEFAULT_ITERATIONS,
      pwKeySize = CryptoManager.DEFAULT_KEYLEN,
      pwDigest = CryptoManager.DEFAULT_DIGEST,
      pwFunc = CryptoManager.DEFAULT_PWFUNC
    } = options;

    // Future: handle other password derivation functions?
    if (pwFunc !== CryptoManager.DEFAULT_PWFUNC) {
      throw new Error(`Unsupported key derivation function ${pwFunc}`);
    }
    if (pwKeySize % 3 !== 0) {
      throw new Error(
        `Derived bytes length must be multiple of 3, received ${pwKeySize}`
      );
    }

    const uipBuffer = new Buffer(uip, "utf8");
    let pwSaltBuffer = new Buffer(this.getRandomValues());
    if (pwSalt) {
      pwSaltBuffer = new Buffer(pwSalt, "base64");
    }

    const cryptoKey = await this.subtleCrypto.importKey(
      "raw",
      uipBuffer,
      pwFunc,
      false,
      ["deriveBits"]
    );

    const masterKeyBuffer = await this.subtleCrypto.deriveBits(
      {
        name: pwFunc,
        salt: pwSaltBuffer,
        iterations: pwCost,
        hash: pwDigest
      },
      cryptoKey,
      pwKeySize * 8 // 8 bits in a byte
    );
    const sepPwIdx = masterKeyBuffer.byteLength / 3;
    const sepMkIdx = sepPwIdx * 2;

    return {
      pw: new Buffer(masterKeyBuffer.slice(0, sepPwIdx)),
      mk: new Buffer(masterKeyBuffer.slice(sepPwIdx, sepMkIdx)),
      ak: new Buffer(
        masterKeyBuffer.slice(sepMkIdx, masterKeyBuffer.byteLength)
      ),
      pwSalt: pwSaltBuffer,
      pwCost,
      pwKeySize,
      pwDigest,
      pwFunc
    };
  }
}
