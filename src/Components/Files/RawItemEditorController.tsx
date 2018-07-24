import React, { Component } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { upsertProcessedItem } from "../../Modules/Reducers/ProcessedItems/Actions";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { upsertRawItem } from "../../Modules/Reducers/RawItems/Actions";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { setStructure } from "../../Modules/Reducers/Structure/Actions";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import {
  addAlert,
  setSelectedItemId
} from "../../Modules/Reducers/Transient/Actions";
import parseGraphQLError from "../Helpers/ParseGraphQLError";
import {
  DELETE_ITEM_MUTATION,
  IDeleteItemResponseData
} from "./ItemFileShared";
import RawItemEditorView from "./RawItemEditorView";

interface IProps {
  dispatch: Dispatch;
  itemId: string;
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
  structure: IStructureState;
  user: FullUser;
}

class RawItemEditorController extends Component<WithApolloClient<IProps>> {
  public render() {
    const { itemId, rawItems, processedItems } = this.props;
    const rawItem = rawItems[itemId];
    const processedItemPayload = processedItems[itemId];
    return (
      <RawItemEditorView
        itemId={itemId}
        rawItem={rawItem}
        processedItemPayload={processedItemPayload}
        handleDeleteItem={this.handleDeleteItem}
      />
    );
  }

  protected handleDeleteItem = async () => {
    try {
      const { dispatch, client, itemId, structure, user } = this.props;
      const response = await client.mutate({
        mutation: DELETE_ITEM_MUTATION,
        variables: { id: itemId }
      });
      const { deleteItem } = response.data as IDeleteItemResponseData;
      const dirId =
        (deleteItem.parent && deleteItem.parent.uuid) || user.username;
      const updatedStructure = [...structure[dirId]];
      const delIdx = updatedStructure.indexOf(deleteItem.uuid);
      if (delIdx >= 0) {
        updatedStructure.splice(delIdx, 1);
      }
      dispatch(
        addAlert({
          type: "success",
          timestamp: deleteItem.updatedAt,
          content: "Successfully deleted item."
        })
      );
      dispatch(setStructure(dirId, updatedStructure));
      dispatch(upsertRawItem(deleteItem));
      dispatch(
        upsertProcessedItem(deleteItem.uuid, deleteItem.updatedAt, null, null)
      );
      dispatch(setSelectedItemId(updatedStructure[0]));
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to delete item!");
      this.props.dispatch(
        addAlert({
          type: "error",
          timestamp: Date.now(),
          content: errors[0] || "Failed to delete item!"
        })
      );
    }
  };
}

const mapStateToProps = (state: IRootState) => {
  const { _persist: _0, ...rawItems } = state.rawItems;
  const { _persist: _1, ...processedItems } = state.processedItems;
  const { _persist: _2, ...structure } = state.structure;
  return { rawItems, processedItems, structure, user: state.auth.authUser! };
};

export default connect(mapStateToProps)(withApollo(RawItemEditorController));
