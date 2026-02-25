import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import md5 from 'crypto-js/md5';

/**
 * A utility method to generate MD5 hash of the string
 */
export function getContentMD5(data = {}) {
  return md5(JSON.stringify(data)).toString();
}

/**
 * A utility method that genrates the authorization header
 */
export function getAuthorization({
  /**
   * http verb denoting type of request, example
   * 'GET', 'POST', 'PUT', 'DELETE' etc
   */
  method,
  contentMd5,
  contentType,
  /**
   * date in ISO-8601 format
   */
  date,
  hashSignKey,
  accessKeyId,
  secretAccesskey,
}) {
  const SEPARATOR = '~';
  const COLON = ':';
  // raw string which need to be encrypted
  const nonEncryptedString =
    method +
    SEPARATOR +
    contentMd5 +
    SEPARATOR +
    contentType +
    SEPARATOR +
    date +
    SEPARATOR;

  //encrypt raw string using HMAC - SHA1 algorithm
  const hmacSha1String = hmacSHA1(nonEncryptedString, hashSignKey).toString();

  //Converted the encrypted string into base 64
  const base64String = Base64.stringify(Utf8.parse(hmacSha1String));

  // console.log("AUTHORIZATION", accessKeyId + COLON + secretAccesskey + COLON + base64String)

  return accessKeyId + COLON + secretAccesskey + COLON + base64String;
}
