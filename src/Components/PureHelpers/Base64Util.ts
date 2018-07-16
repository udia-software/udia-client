/*
 * TypeScript utility functions for handling base64 and base64url data.
 */

/* tslint:disable:no-bitwise */

// base64 reference string
const B64C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// base64url reference string
const B64U = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const B64PAD = "="; // base64 padding character

/**
 * Internal helper to encode data to base64 using specified dictionary.
 */
const base64EncodeData = (data: string, b64x: string) => {
  const len = data.length;
  let dst = "";
  let i;

  for (i = 0; i <= len - 3; i += 3) {
    dst += b64x.charAt(data.charCodeAt(i) >>> 2);
    dst += b64x.charAt(
      ((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4)
    );
    dst += b64x.charAt(
      ((data.charCodeAt(i + 1) & 15) << 2) | (data.charCodeAt(i + 2) >>> 6)
    );
    dst += b64x.charAt(data.charCodeAt(i + 2) & 63);
  }

  if (len % 3 === 2) {
    dst += b64x.charAt(data.charCodeAt(i) >>> 2);
    dst += b64x.charAt(
      ((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4)
    );
    dst += b64x.charAt((data.charCodeAt(i + 1) & 15) << 2);
    dst += B64PAD;
  } else if (len % 3 === 1) {
    dst += b64x.charAt(data.charCodeAt(i) >>> 2);
    dst += b64x.charAt((data.charCodeAt(i) & 3) << 4);
    dst += B64PAD;
    dst += B64PAD;
  }

  return dst;
};

/**
 * Internal helper to translate a base64 character to its integer index.
 */
const base64CharIndex = (c: string) => {
  if (c === "+") {
    return 62;
  } else if (c === "/") {
    return 63;
  }
  return B64U.indexOf(c);
};

/*
 * Encode a JavaScript string to base64.
 * Specified string is first converted from JavaScript UCS-2 to UTF-8.
 */
export const base64Encode = (str: string) => {
  const utf8str = unescape(encodeURIComponent(str));
  return base64EncodeData(utf8str, B64C);
};

/*
 * Encode a JavaScript string to base64url.
 * Specified string is first converted from JavaScript UCS-2 to UTF-8.
 */
export const base64UrlEncode = (str: string) => {
  const utf8str = unescape(encodeURIComponent(str));
  return base64EncodeData(utf8str, B64U);
};

/*
 * Decode a base64 or base64url string to a JavaScript string.
 * Input is assumed to be a base64/base64url encoded UTF-8 string
 * Throws URIError if supplied data is invalid.
 * Returned result is a JavaScript (UCS-2) string.
 */
export const base64Decode = (data: string) => {
  let dst = "";
  for (let i = 0; i < data.length - 3; i += 4) {
    const a = base64CharIndex(data.charAt(i + 0));
    const b = base64CharIndex(data.charAt(i + 1));
    const c = base64CharIndex(data.charAt(i + 2));
    const d = base64CharIndex(data.charAt(i + 3));

    dst += String.fromCharCode((a << 2) | (b >>> 4));
    if (data.charAt(i + 2) !== B64PAD) {
      dst += String.fromCharCode(((b << 4) & 0xf0) | ((c >>> 2) & 0x0f));
    }
    if (data.charAt(i + 3) !== B64PAD) {
      dst += String.fromCharCode(((c << 6) & 0xc0) | d);
    }
  }
  return decodeURIComponent(escape(dst));
};
