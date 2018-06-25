import { ThemedStyledProps } from "styled-components";
import { IThemeInterface } from "src/Components/AppStyles";

// images and static files
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";

declare interface UserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  verificationExpiry: number;
}

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

// gross code to handle try/catch/finally logic in the app
declare interface isMountable {
  isMountableMounted: boolean;
}
