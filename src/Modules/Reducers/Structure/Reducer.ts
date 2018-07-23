import { CLEAR_STRUCTURE, IStructureAction, SET_STRUCTURE } from "./Actions";

export interface IStructureState {
  [id: string]: string[];
}

const DefaultStructureState = Object.create(null);

export default (
  state: IStructureState = DefaultStructureState,
  action: IStructureAction
) => {
  switch (action.type) {
    case SET_STRUCTURE: {
      return {
        ...state,
        [action.payload.dirId]: action.payload.itemIds
      };
    }
    case CLEAR_STRUCTURE: {
      return { ...DefaultStructureState };
    }
    default:
      return state;
  }
};
