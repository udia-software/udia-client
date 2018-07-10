// GraphQL FullUser
declare interface FullUser {
  uuid: string;
  username: string;
  emails: UserEmail[];
  encSecretKey: string;
  pubVerifyKey: string;
  encPrivateSignKey: string;
  pubEncryptKey: string;
  encPrivateDecryptKey: string;
  pwFunc: string;
  pwDigest: string;
  pwCost: number;
  pwKeySize: number;
  pwNonce: string;
  createdAt: number;
  updatedAt: number;
}