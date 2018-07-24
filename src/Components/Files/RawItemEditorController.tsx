import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import RawItemEditorView from "./RawItemEditorView";

interface IProps {
  dispatch: Dispatch;
  itemId: string;
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
}

class RawItemEditorController extends Component<IProps> {
  public render() {
    const { itemId, rawItems, processedItems } = this.props;
    const rawItem = rawItems[itemId];
    const processedItemPayload = processedItems[itemId];
    return (
      <RawItemEditorView
        itemId={itemId}
        rawItem={rawItem}
        processedItemPayload={processedItemPayload}
      />
    );
  }
}

const mapStateToProps = (state: IRootState) => {
  const { _persist: _0, ...rawItems } = state.rawItems;
  const { _persist: _1, ...processedItems } = state.processedItems;
  return { rawItems, processedItems };
};

export default connect(mapStateToProps)(RawItemEditorController);
