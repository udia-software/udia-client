import React, { Component } from "react";
import { connect } from "react-redux";
import { match, Redirect } from "react-router";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { setSelectedItemId } from "../../Modules/Reducers/Transient/Actions";
import { BaseTheme } from "../AppStyles";
import { determineContentViewer } from "./ItemFileShared";

const { smScrnBrkPx } = BaseTheme;

interface IProps {
  dispatch: Dispatch;
  processedItems: IProcessedItemsState;
  rawItems: IRawItemsState;
  draftItems: IDraftItemsState;
  match: match<{ id: string }>;
}

interface IState {
  isSmallScreen: boolean;
}

/**
 * this is a helper class for small screen devices that don't support side by side viewing of note & file list
 */
class DisplayFileController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isSmallScreen: window.innerWidth < smScrnBrkPx
    };
  }

  public componentDidMount() {
    window.addEventListener("resize", this.handleResizeEvent);
    const {
      dispatch,
      match: {
        params: { id }
      }
    } = this.props;
    dispatch(setSelectedItemId(id));
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeEvent);
  }

  public render() {
    const {
      processedItems,
      draftItems,
      rawItems,
      match: {
        params: { id }
      }
    } = this.props;
    const { isSmallScreen } = this.state;
    if (!isSmallScreen) {
      return <Redirect to="/file" />;
    }
    return (
      <div style={{ width: "100%", height: "100%" }}>
        {determineContentViewer(id, processedItems, draftItems, rawItems)}
      </div>
    );
  }

  protected handleResizeEvent = () => {
    this.setState({
      isSmallScreen: window.innerWidth < smScrnBrkPx
    });
  };
}

const mapStateToProps = (state: IRootState) => {
  const { _persist: _0, ...processedItems } = state.processedItems;
  const { _persist: _1, ...rawItems } = state.rawItems;
  const { _persist: _2, ...draftItems } = state.draftItems;

  return {
    processedItems,
    rawItems,
    draftItems
  };
};
export default connect(mapStateToProps)(DisplayFileController);
