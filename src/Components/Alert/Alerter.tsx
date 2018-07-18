import { DateTime } from "luxon";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { removeAlert } from "../../Modules/Reducers/Transient/Actions";
import styled from "../AppStyles";
import { MutedSpan } from "../Notes/NotesShared";

const AlertsContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
`;

const AlertContainer = styled.div.attrs<{
  type?: "info" | "success" | "error";
}>({})`
  top: 0;
  bottom: auto;
  left: auto;
  border-radius: 3px;
  min-width: 15em;
  padding: 0.4em;
  margin: 0.3em;
  color: ${props => {
    switch (props.type) {
      case "success":
        return props.theme.inputSuccessColor;
      case "error":
        return props.theme.inputErrorColor;
      case "info":
      default:
        return props.theme.primaryColor;
    }
  }};
  border: 3px outset
    ${props => {
      switch (props.type) {
        case "success":
          return props.theme.inputSuccessBorderColor;
        case "error":
          return props.theme.inputErrorBorderColor;
        case "info":
        default:
          return props.theme.purple;
      }
    }};
  background-color: ${props => props.theme.panelBackgroundColor};
  cursor: pointer;
`;

interface IProps {
  dispatch: Dispatch;
  alerts: AlertContent[];
}

interface IState {
  [index: string]: number
}

const DISMISS_ALERT_MS = 5000;

class AlertWrapper extends Component<IProps, IState> {
  public componentDidUpdate(prevProps: IProps) {
    const newAlerts = this.props.alerts.filter(
      alertPayload => prevProps.alerts.indexOf(alertPayload) < 0
    );
    newAlerts.forEach(newAlertPayload => {
      const alertKey = this.alertToString(newAlertPayload);
      this.setState({...this.state, [alertKey]: window.setTimeout(() => {
        const idx = this.props.alerts.indexOf(newAlertPayload);
        this.props.dispatch(removeAlert(idx));
      }, DISMISS_ALERT_MS)})
    })
  }

  public render() {
    const { alerts } = this.props;
    return (
      <AlertsContainer>
        {alerts.map(({ timestamp, type, content }, idx) => (
          <AlertContainer
            key={this.alertToString({ timestamp, type, content })}
            onClick={this.handleDismissAlert(idx)}
          >
            {content}{" "}
            <MutedSpan>
              {DateTime.fromMillis(timestamp).toLocaleString(
                DateTime.TIME_WITH_SHORT_OFFSET
              )}
            </MutedSpan>
          </AlertContainer>
        ))}
      </AlertsContainer>
    );
  }

  private handleDismissAlert = (idx: number) => () => {
    const { dispatch } = this.props;
    dispatch(removeAlert(idx));
  };

  private alertToString = ({ timestamp, type, content }: AlertContent) =>
    `${type}-${timestamp}-${content}`;
}

const mapStateToProps = (state: IRootState) => ({
  alerts: state.transient.alerts
});

export default connect(mapStateToProps)(AlertWrapper);
