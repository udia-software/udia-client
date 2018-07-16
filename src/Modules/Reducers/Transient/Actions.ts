export const HANDLE_APP_JUST_LOADED = "transiet/HANDLE_APP_JUST_LOADED";

export interface IHandleAppJustLoaded {
  type: typeof HANDLE_APP_JUST_LOADED;
}

export type ITransientAction = IHandleAppJustLoaded;

export const handleAppJustLoaded = (): IHandleAppJustLoaded => ({
  type: HANDLE_APP_JUST_LOADED
});
