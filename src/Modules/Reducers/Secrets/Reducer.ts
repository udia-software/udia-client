import {
  CLEAR_SECRETS_DATA,
  ISecretsAction,
  SET_BASE_64_AK,
  SET_BASE_64_MK
} from "./Actions";

export interface ISecretsState {
  mkB64?: string;
  akB64?: string;
}

const DefaultSecretState: ISecretsState = {};

export default (
  state: ISecretsState = { ...DefaultSecretState },
  action: ISecretsAction
) => {
  switch (action.type) {
    case SET_BASE_64_MK:
      return { ...state, mkB64: action.payload };
    case SET_BASE_64_AK:
      return { ...state, akB64: action.payload };
    case CLEAR_SECRETS_DATA:
      return {};
    default:
      return { ...state };
  }
};
