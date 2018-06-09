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
 * Collection of helper methods for encryption, decryption, signing, and verification
 * In accordance with the UDIA API specification
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

  public async deriveMasterKeyBuffers(
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

    const uipBuffer = Buffer.from(uip, "utf8");
    let pwSaltBuffer = Buffer.from(this.getRandomValues().buffer);
    if (pwSalt) {
      pwSaltBuffer = Buffer.from(pwSalt, "base64");
    }

    const cryptoKey = await this.subtleCrypto.importKey(
      "raw",
      uipBuffer,
      pwFunc,
      false,
      ["deriveBits"]
    );

    const masterBuffer = await this.subtleCrypto.deriveBits(
      {
        name: pwFunc,
        salt: pwSaltBuffer,
        iterations: pwCost,
        hash: pwDigest
      },
      cryptoKey,
      pwKeySize * 8 // 8 bits in a byte
    );
    const sepPwIdx = masterBuffer.byteLength / 3;
    const sepMkIdx = sepPwIdx * 2;

    return {
      pw: Buffer.from(masterBuffer.slice(0, sepPwIdx)),
      mk: Buffer.from(masterBuffer.slice(sepPwIdx, sepMkIdx)),
      ak: Buffer.from(masterBuffer.slice(sepMkIdx, masterBuffer.byteLength)),
      pwSalt: pwSaltBuffer,
      pwCost,
      pwKeySize,
      pwDigest,
      pwFunc
    };
  }

  /**
   * Generate a new CryptoKey for symmetric encryption.
   * Uses Advanced Encryption Standard - Galois Counter Mode, length 256
   */
  public async generateSymmetricEncryptionKey() {
    return this.subtleCrypto.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    );
  }

  /**
   * Generate a new CryptoKeyPair for asymmetric signing.
   * Uses Elliptic Curve Digital Signature Algorithm, curve P-521
   */
  public async generateAsymmetricSigningKeyPair() {
    return this.subtleCrypto.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-521"
      },
      true,
      ["sign", "verify"]
    );
  }

  /**
   * Generate a new CryptoKeyPair for asymmetric encryption.
   * Rivest–Shamir–Adleman Optimal Asymmetric Encryption Padding, publicExponent 3, modulusLength 4096
   */
  public async generateAsymmetricEncryptionKeyPair() {
    return this.subtleCrypto.generateKey(
      {
        name: "RSA-OAEP",
        publicExponent: new Uint8Array([1, 0, 1]),
        modulusLength: 4096,
        hash: { name: "SHA-512" }
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  /**
   * Export a crypto key as an array buffer
   * @param {CryptoKey} key
   */
  public async exportRawKey(key: CryptoKey) {
    return this.subtleCrypto.exportKey("raw", key);
  }

  /**
   * Export a crypto key as a JSON Web Key
   * @param {CryptoKey} key
   */
  public async exportJsonWebKey(key: CryptoKey) {
    return this.subtleCrypto.exportKey("jwk", key);
  }

  /**
   * Encrypt a buffer using a secret (like mk)
   * Return a string payload of base64 encoded parameters separated by `:`
   * @param {Buffer} unencryptedInput unencrypted buffer
   * @param {Buffer} secret encryption secret key (usually mk)
   */
  public async encryptWithSecret(unencryptedInput: Buffer, secret: Buffer) {
    const secretHash = await this.subtleCrypto.digest("SHA-512", secret);
    const iv = this.getRandomValues(12);
    const alg = { name: "AES-GCM", iv };
    const key = await this.subtleCrypto.importKey(
      "raw",
      secretHash,
      "AES-GCM",
      false,
      ["encrypt"]
    );
    const encryptedOutput = await this.subtleCrypto.encrypt(
      alg,
      key,
      unencryptedInput
    );
    // convert to base64, join by colon
    const ivBase64 = Buffer.from(iv.buffer).toString("base64");
    const encBase64 = Buffer.from(encryptedOutput).toString("base64");
    return `${ivBase64}:${encBase64}`;
  }

  /**
   * Decrypt a string payload using a secret (like mk)
   * Return an ArrayBuffer containing the original encrypted value
   * @param {string} encryptedPayload encrypted payload ivBase64:encBase64
   * @param {Buffer} secret decryption secret key (usually mk)
   */
  public async decryptWithSecret(
    encryptedPayload: string,
    secret: Buffer
  ) {
    const encPayloadParts = encryptedPayload.split(":");
    if (encPayloadParts.length !== 2) {
      throw new Error(`EncryptedPayload must be in form "ivBase64:encBase64"`);
    }
    const [ivBase64, encBase64] = encPayloadParts;
    const iv = Buffer.from(ivBase64, "base64");
    const encData = Buffer.from(encBase64, "base64");

    const secretHash = await this.subtleCrypto.digest("SHA-512", secret);
    const key = await this.subtleCrypto.importKey(
      "raw",
      secretHash,
      "AES-GCM",
      false,
      ["decrypt"]
    );
    return this.subtleCrypto.decrypt({
      name: "AES-GCM",
      iv,
    }, key, encData);

  }

  /**
   * Helper method for string payloads.
   * @param {string} unencryptedString unencrypted string utf8 encoded
   * @param {Buffer} secret encryption secret key (usually mk)
   */
  public async encryptFromStringWithSecret(unencryptedString: string, secret: Buffer) {
    return this.encryptWithSecret(Buffer.from(unencryptedString), secret);
  }

  /**
   * Helper method for returning string output.
   * @param {string} encryptedPayload encrypted payload ivBase64:encBase64
   * @param {Buffer} secret decryption secret key (usually mk)
   */
  public async decryptToStringWithSecret(encryptedPayload: string, secret: Buffer) {
    const decData = await this.decryptWithSecret(encryptedPayload, secret);
    return Buffer.from(decData).toString();
  }


}
