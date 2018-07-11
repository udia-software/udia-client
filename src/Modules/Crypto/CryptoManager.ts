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
  pwNonce?: string; // optional salt from getAuthParams (base64 encoded string)
  pwCost?: number; // number of iterations
  pwKeySize?: number; // derived key buffer size
  pwDigest?: string; // webcrypto digest function to use
  pwFunc?: string; // webcrypto password derivation function to use
}

export interface IMasterKeyBuffers {
  pw: ArrayBuffer;
  mk: ArrayBuffer;
  ak: ArrayBuffer;
  pwNonce: ArrayBuffer;
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
  private static PROTOCOL_VERSION = "001";
  private static DEFAULT_ITERATIONS = 100000;
  private static DEFAULT_KEYLEN = 2040;
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

  /**
   * Check here to see if the user's password is long enough.
   * @param {string} userInputtedPassword user entered string
   */
  public validateUserInputtedPassword(userInputtedPassword: string) {
    const bufferedPassword = Buffer.from(userInputtedPassword, "utf8");
    const errors: string[] = [];
    if (bufferedPassword.length < 8) {
      errors.push("Master password must be 8 or more characters.");
    }
    return errors;
  }

  /**
   * Return a randomly initialized Uint8Array of given length
   * @param {number} length size of array, or bytes to generate
   */
  public getRandomValues(length: number = 128) {
    const randomValues = new Uint8Array(length);
    this.globalCrypto.getRandomValues(randomValues);
    return randomValues;
  }

  /**
   * Given user input, nonce (or a randome one will be generated), plus encryption options
   * derive three 256 bit secrets pw, mk, ak and return options for next time
   * This method may throw an error, ensure it is caught!
   * @param {IDerivePasswordOptions} options - Options for generating the three derived secrets
   * @returns {Promise<IMasterKeyBuffers>} - Contains the secrets for encryption/decryption on the clietn
   */
  public async deriveMasterKeyBuffers(
    options: IDerivePasswordOptions
  ): Promise<IMasterKeyBuffers> {
    const {
      userInputtedPassword: uip,
      pwNonce,
      pwCost = CryptoManager.DEFAULT_ITERATIONS,
      pwKeySize = CryptoManager.DEFAULT_KEYLEN,
      pwDigest = CryptoManager.DEFAULT_DIGEST,
      pwFunc = CryptoManager.DEFAULT_PWFUNC
    } = options;

    this.validateDerivationFn(pwFunc);
    this.validateDerivedKeyLen(pwKeySize);
    this.validateDerivationCost(pwCost);
    this.validateDerivationDigest(pwDigest);

    // Create a nonce Buffer containng 512 bits of randomness, or load user provided Base64 string
    let pwNonceBuffer = Buffer.from(this.getRandomValues(64).buffer);
    if (pwNonce) {
      pwNonceBuffer = Buffer.from(pwNonce, "base64");
    }

    // Always assume user input is a UTF-8 string. Convert it to a Buffer
    const uipBuffer = Buffer.from(uip, "utf8");

    // Generate a salt buffer using the provided Nonce
    let pwSaltBuffer: Buffer;
    try {
      // String representation of pwCost + nonce run through SHA-512 once
      pwSaltBuffer = Buffer.from(
        await this.subtleCrypto.digest(
          "SHA-512",
          Buffer.concat([
            Buffer.from(JSON.stringify(pwCost), "utf8"),
            pwNonceBuffer
          ])
        )
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(
        "ERR subtleCrypto.digest",
        "SHA-512",
        Buffer.concat([
          Buffer.from(JSON.stringify(pwCost), "utf8"),
          pwNonceBuffer
        ])
      );
      throw err;
    }

    // Derive the base key using PBKDF2 and the user inputted password buffer
    let baseKey;
    try {
      baseKey = await this.subtleCrypto.importKey(
        "raw",
        uipBuffer,
        pwFunc,
        false,
        ["deriveBits"]
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(
        "ERR subtleCrypto.importKey",
        "raw",
        uipBuffer,
        pwFunc,
        false,
        ["deriveBits"]
      );
      throw err;
    }

    // Derive the master buffer secret using the derived base key, at least 100000 iterations of "PBKDF2" & SHA-512
    let masterBuffer;
    const algorithm = {
      name: pwFunc,
      salt: pwSaltBuffer,
      iterations: pwCost,
      hash: pwDigest
    };
    try {
      masterBuffer = await this.subtleCrypto.deriveBits(
        algorithm,
        baseKey,
        pwKeySize
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(
        `ERR subtleCrypto.deriveBits ${pwKeySize}`,
        algorithm,
        baseKey
      );
      throw err;
    }

    // Split the master buffer to three derived keys
    const sepPwIdx = masterBuffer.byteLength / 3;
    const sepMkIdx = sepPwIdx * 2;

    return {
      pw: masterBuffer.slice(0, sepPwIdx),
      mk: masterBuffer.slice(sepPwIdx, sepMkIdx),
      ak: masterBuffer.slice(sepMkIdx, masterBuffer.byteLength),
      pwNonce: pwNonceBuffer.buffer,
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
   * Export the crypto key as a JSON Web Key
   * @param {CryptoKey} key should be one of the client generated crypto keys
   */
  public async exportJsonWebKey(key: CryptoKey) {
    return this.subtleCrypto.exportKey("jwk", key);
  }

  /**
   * Import the public verification key from a JsonWebKey
   * @param {JsonWebKey} rawJWK should be the public ECDSA verification key
   */
  public async importPublicVerifyJsonWebKey(rawJWK: JsonWebKey) {
    return this.subtleCrypto.importKey(
      "jwk",
      rawJWK,
      { name: "ECDSA", namedCurve: "P-521" },
      true,
      ["verify"]
    );
  }

  /**
   * Import the private signing key from a JsonWebKey
   * @param {JsonWebKey} rawJWK  should be the private ECDSA signing key
   */
  public async importPrivateSignJsonWebKey(rawJWK: JsonWebKey) {
    return this.subtleCrypto.importKey(
      "jwk",
      rawJWK,
      { name: "ECDSA", namedCurve: "P-521" },
      true,
      ["sign"]
    );
  }

  /**
   * Import the secret encryption key from a JsonWebKey
   * @param rawJWK should be the AES-GCM secret key
   */
  public async importSecretJsonWebKey(rawJWK: JsonWebKey) {
    return this.subtleCrypto.importKey("jwk", rawJWK, "AES-GCM", true, [
      "encrypt",
      "decrypt",
      "wrapKey",
      "unwrapKey"
    ]);
  }

  /**
   * Import the public encryption key from a JsonWebKey
   * @param rawJWK should be the RSA-OAEP public encryption key
   */
  public async importPublicEncryptJsonWebKey(rawJWK: JsonWebKey) {
    return this.subtleCrypto.importKey(
      "jwk",
      rawJWK,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-512" }
      },
      true,
      ["encrypt"]
    );
  }

  /**
   * Import the public encryption key from a JsonWebKey
   * @param rawJWK should be the RSA-OAEP private decryption key
   */
  public async importPrivateDecryptionJsonWebKey(rawJWK: JsonWebKey) {
    return this.subtleCrypto.importKey(
      "jwt",
      rawJWK,
      { name: "RSA-OAEP", hash: "SHA-512" },
      true,
      ["decrypt"]
    );
  }

  /**
   * Encrypt a buffer using a secret (like mk)
   * Return a string payload of base64 encoded parameters separated by `:`
   * @param {ArrayBuffer} unencryptedInput unencrypted buffer
   * @param {ArrayBuffer} secret encryption secret key (like mk)
   * @param {ArrayBuffer?} add optional additional data (usually ECDSA signature)
   */
  public async encryptWithSecret(
    unencryptedInput: ArrayBuffer,
    secret: ArrayBuffer,
    add?: ArrayBuffer
  ) {
    // run through SHA-256 to ensure 256 bytes used in AES-GCM
    const secretHash = await this.subtleCrypto.digest("SHA-256", secret);

    const key = await this.subtleCrypto.importKey(
      "raw",
      secretHash,
      "AES-GCM",
      false,
      ["encrypt"]
    );
    return this.encryptWithSecretKey(unencryptedInput, key, add);
  }

  /**
   * Decrypt a string payload using a secret (like mk)
   * Return an ArrayBuffer containing the original encrypted value
   * @param {string} encryptedPayload encrypted payload "ver:taglenBase64:addBase64:ivBase64:encBase64"
   * @param {ArrayBuffer} secret decryption secret key (like mk)
   */
  public async decryptWithSecret(
    encryptedPayload: string,
    secret: ArrayBuffer
  ) {
    const secretHash = await this.subtleCrypto.digest("SHA-256", secret);
    const key = await this.subtleCrypto.importKey(
      "raw",
      secretHash,
      "AES-GCM",
      false,
      ["decrypt"]
    );
    return this.decryptWithSecretKey(encryptedPayload, key);
  }

  /**
   * Encrypt a buffer using a CryptoKey
   * @param {ArrayBuffer} unencryptedInput unencrypted buffer
   * @param {CryptoKey} key should be from generateSymmetricEncryptionKey method
   * @param {ArrayBuffer?} add optional additional data (usually ECDSA signature)
   */
  public async encryptWithSecretKey(
    unencryptedInput: ArrayBuffer,
    key: CryptoKey,
    add?: ArrayBuffer
  ) {
    // ensure iv is 12 bytes (96 bits) for optimal calculation
    const iv = this.getRandomValues(12).buffer;

    // explicitly set tagLength to the max value of 128 bits
    const alg: AesGcmParams = { name: "AES-GCM", iv, tagLength: 128 };
    if (add) {
      // chrome doesn't properly handle undefined, so we have to do conditional set
      alg.additionalData = add;
    }

    const encryptedOutput = await this.subtleCrypto.encrypt(
      alg,
      key,
      unencryptedInput
    );
    // convert to base64, join by colon
    const version = CryptoManager.PROTOCOL_VERSION;
    const tagLenB64 = btoa(`${alg.tagLength}`);
    const addB64 = add ? Buffer.from(add).toString("base64") : "";
    const ivB64 = Buffer.from(iv).toString("base64");
    const encBase64 = Buffer.from(encryptedOutput).toString("base64");
    return `${version}:${tagLenB64}:${addB64}:${ivB64}:${encBase64}`;
  }

  public async decryptWithSecretKey(encryptedPayload: string, key: CryptoKey) {
    const encPayloadParts = encryptedPayload.split(":");
    if (encPayloadParts.length !== 5) {
      throw new Error(
        `EncryptedPayload must be in form "ver:taglenBase64:addBase64:ivBase64:encBase64"`
      );
    }
    const [
      version,
      tagLenBase64,
      addBase64,
      ivBase64,
      encBase64
    ] = encPayloadParts;
    if (version !== CryptoManager.PROTOCOL_VERSION) {
      throw new Error(`Unsupported encryption version ${version}`);
    }
    const tagLength = parseInt(atob(tagLenBase64), 10);
    const add = !!addBase64 ? Buffer.from(addBase64, "base64").buffer : undefined;
    const iv = Buffer.from(ivBase64, "base64");
    const encData = Buffer.from(encBase64, "base64");

    const alg: AesGcmParams = {
      name: "AES-GCM",
      iv,
      tagLength
    };
    if (add) {
      alg.additionalData = add;
    }

    return this.subtleCrypto.decrypt(alg, key, encData);
  }

  /**
   * Verify a message using the asymmetric public verification key (ECDSA keypair publicKey value)
   * @param {CryptoKey} publicKey public ECDSA SHA-512 verification key
   * @param {ArrayBuffer} signature signature that was generated with the key and data provided
   * @param {ArrayBuffer} data payload that was signed
   */
  public async verifyWithPublicKey(
    publicKey: CryptoKey,
    signature: ArrayBuffer,
    data: ArrayBuffer
  ) {
    return this.subtleCrypto.verify(
      { name: "ECDSA", hash: { name: "SHA-512" } },
      publicKey,
      signature,
      data
    );
  }

  /**
   * Sign a message using the asymmetric private signing key (ECDSA keypair privateKey value)
   * @param {CryptoKey} privateKey private ECDSA SHA-512 signing key
   * @param {ArrayBuffer} data payload to sign
   */
  public async signWithPrivateKey(privateKey: CryptoKey, data: ArrayBuffer) {
    return this.subtleCrypto.sign(
      { name: "ECDSA", hash: { name: "SHA-512" } },
      privateKey,
      data
    );
  }

  /**
   * In the future, would be nice to support BCrypt, Argon2, Scrypt, etc.
   * @param {string} pwFunc password function to be used in deriving keys
   */
  private validateDerivationFn(pwFunc: string) {
    if (pwFunc !== CryptoManager.DEFAULT_PWFUNC) {
      throw new Error(
        `Password function must be ${
          CryptoManager.DEFAULT_PWFUNC
        }, received ${pwFunc}`
      );
    }
  }

  /**
   * Quick check to make sure that we can generate proper output keys
   * @param {number} pwKeySize length of the root buffer to derive from pbkdf2
   */
  private validateDerivedKeyLen(pwKeySize: number) {
    const ok =
      pwKeySize % 3 === 0 &&
      pwKeySize % 8 === 0 &&
      pwKeySize < 2048 &&
      pwKeySize >= 768;
    if (!ok) {
      throw new Error(
        `Derived bytes length must be ` +
          `divisible by 3 and divisible by 8 and be ` +
          `less than 2048 and be greater than or equal to 768, received ${pwKeySize}`
      );
    }
  }

  private validateDerivationCost(pwCost: number) {
    if (pwCost < CryptoManager.DEFAULT_ITERATIONS) {
      throw new Error(
        `Iteration cost cannot be less than ${
          CryptoManager.DEFAULT_ITERATIONS
        }, received ${pwCost}`
      );
    }
  }

  private validateDerivationDigest(pwDigest: string) {
    const VALID_DIGESTS = ["SHA-512", "SHA-256"];
    if (!(VALID_DIGESTS.indexOf(pwDigest) > -1)) {
      throw new Error(
        `Digest function must be one of ${VALID_DIGESTS.join(
          ", "
        )}, received ${pwDigest}`
      );
    }
  }
}
