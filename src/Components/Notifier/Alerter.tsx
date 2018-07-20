import { DateTime } from "luxon";
import React, { Component } from "react";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { removeAlert } from "../../Modules/Reducers/Transient/Actions";
import styled from "../AppStyles";
import { MutedSpan } from "../Notes/NotesShared";

const DISMISS_ALERT_MS = 5000;
const TRANSITION_TIMEOUT_MS = 200;
const TRANSITION_CLASSNAME = "alert";

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
  max-width: 18em;
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
  &.${TRANSITION_CLASSNAME + "-enter"} {
    opacity: 0.01;
  }
  &.${TRANSITION_CLASSNAME + "-enter-active"} {
    opacity: 1;
    transition: opacity ${TRANSITION_TIMEOUT_MS}ms ease-in;
  }
  &.${TRANSITION_CLASSNAME + "-exit"} {
    opacity: 1;
  }
  &.${TRANSITION_CLASSNAME + "-exit-active"} {
    opacity: 0.01;
    transition: opacity ${TRANSITION_TIMEOUT_MS}ms ease-in;
  }
`;

interface IProps {
  dispatch: Dispatch;
  alerts: AlertContent[];
}

class AlertWrapper extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const { alerts } = this.props;
    alerts.map(cur => this.initDismimssTimeout(cur));
  }

  public componentDidUpdate(prevProps: IProps) {
    const newAlerts = this.props.alerts.filter(
      alertPayload => prevProps.alerts.indexOf(alertPayload) < 0
    );
    newAlerts.map(cur => this.initDismimssTimeout(cur));
  }

  public render() {
    const { alerts } = this.props;
    return (
      <AlertsContainer>
        <TransitionGroup>
          {alerts.map((payload, idx) => (
            <CSSTransition
              key={payload.timestamp} // should be fine
              timeout={TRANSITION_TIMEOUT_MS}
              classNames={TRANSITION_CLASSNAME}
            >
              <AlertContainer
                onClick={this.handleDismissAlertByIndex(idx)}
                type={payload.type}
              >
                {payload.content}{" "}
                <MutedSpan>
                  {DateTime.fromMillis(payload.timestamp).toLocaleString(
                    DateTime.TIME_WITH_SHORT_OFFSET
                  )}
                </MutedSpan>
              </AlertContainer>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </AlertsContainer>
    );
  }

  private handleDismissAlertByIndex = (idx: number) => () => {
    this.props.dispatch(removeAlert(idx));
  };

  private initDismimssTimeout = (cur: AlertContent) =>
    window.setTimeout(() => {
      const idx = this.props.alerts.indexOf(cur);
      this.handleDismissAlertByIndex(idx)();
    }, DISMISS_ALERT_MS);
}

const mapStateToProps = (state: IRootState) => ({
  alerts: state.transient.alerts
});

export default connect(mapStateToProps)(AlertWrapper);
