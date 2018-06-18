import { ThemedStyledProps } from "styled-components";
import { IThemeInterface } from "src/Components/AppStyles";

declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.json";
type ThemedComponentProps<P> = ThemedStyledProps<P, IThemeInterface>;
