// Action serializable and unique type strings
export const SET_BASE_64_MK = "secrets/SET_BASE_64_MK";
export const SET_BASE_64_AK = "secrets/SET_BASE_64_AK";
export const CLEAR_SECRETS_DATA = "secrests/CLEAR_SECRETS_DATA";

// Action interfaces
export interface ISetBase64MK {
  type: typeof SET_BASE_64_MK;
  payload: string;
}

export interface ISetBase64AK {
  type: typeof SET_BASE_64_AK;
  payload: string;
}

export interface IClearSecretsData {
  type: typeof CLEAR_SECRETS_DATA;
}

export type ISecretsAction = ISetBase64MK | ISetBase64AK | IClearSecretsData;

export const setBase64MK = (b64MK: string): ISetBase64MK => ({
  type: SET_BASE_64_MK,
  payload: b64MK
});

export const setBase64AK = (b64AK: string): ISetBase64AK => ({
  type: SET_BASE_64_AK,
  payload: b64AK
});

export const clearSecretsData = (): IClearSecretsData => ({
  type: CLEAR_SECRETS_DATA
});
