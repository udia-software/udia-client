import { ThemedStyledProps } from "styled-components";
import { IThemeInterface } from "../Components/AppStyles";

// images and static files
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";

// Not the full user, but the 'publicly visible' user
declare interface User {
  uuid: string;
  username: string;
  createdAt: number;
  pubVerifyKey: string;
  pubEncryptKey: string;
}

// gross workaround to handle setState after unmounted try/catch/finally logic in the app
declare interface isMountable {
  isMountableMounted: boolean;
}
