import { ThemedStyledProps } from "styled-components";
import { IThemeInterface } from "src/Components/AppStyles";

// images and static files
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*package.json" {
  export const name: string;
  export const version: string;
}

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
  pubSignKey: string;
  encPrivSignKey: string;
  pubEncKey: string;
  encPrivEncKey: string;
  pwFunc: string;
  pwDigest: string;
  pwCost: number;
  pwKeySize: number;
  pwNonce: string;
  createdAt: number;
  updatedAt: number;
}

