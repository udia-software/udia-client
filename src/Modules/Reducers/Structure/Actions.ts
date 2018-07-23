export const SET_STRUCTURE = "structure/SET_STRUCTURE";
export const CLEAR_STRUCTURE = "structure/CLEAR_STRUCTURE";

export interface ISetStructureAction {
  type: typeof SET_STRUCTURE;
  payload: {
    dirId: string;
    itemIds: string[];
  };
}
export const setStructure = (
  dirId: string,
  itemIds: string[]
): ISetStructureAction => ({
  type: SET_STRUCTURE,
  payload: { dirId, itemIds }
});

export interface IClearStructureAction {
  type: typeof CLEAR_STRUCTURE;
}
export const clearStructure = (): IClearStructureAction => ({
  type: CLEAR_STRUCTURE
});

export type IStructureAction =
  | ISetStructureAction
  | IClearStructureAction;
