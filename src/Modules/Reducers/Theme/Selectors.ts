import { IRootState } from "../RootReducer";

export const isUsingDarkTheme = (state: IRootState) => {
  return state.theme.usingDarkTheme;
};
