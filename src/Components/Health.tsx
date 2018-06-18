import gql from "graphql-tag";
import React, { Component } from "react";
import { DataValue, graphql, OperationVariables } from "react-apollo";
import { ThemedStyledProps } from "styled-components";
import { APP_VERSION } from "../Constants";
import styled, { IThemeInterface } from "./AppStyles";

const HealthContainer = styled.div`
  width: 100%;
  display: grid;
  place-content: center;
  place-items: center;
  dl > dt {
    padding-left: 0.5em;
  }
`;

const CenterParagraph = styled.p`
  text-align: center;
`;

const ErrorableListTitle = styled.dt`
  color: ${(
    props: ThemedStyledProps<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
      IThemeInterface
    > & { isErr?: boolean; isWarn?: boolean }
  ) =>
    props.isErr ? "red" : props.isWarn ? "yellow" : props.theme.primaryColor};
`;

interface IProps {
  HealthMetricQuery: () => any;
  subscribeToNewHealthMetrics: () => any;
  data?: DataValue<IHealthResponseData, OperationVariables>;
}

interface IState {
  intervalId: any;
  timerHeartbeat: Date;
}

const WARN_SKEW_MS = 4000;

class Health extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "Health - UDIA";
    this.state = {
      intervalId: setInterval(this.clientSecondTimer, 1000),
      timerHeartbeat: new Date()
    };
  }

  public async componentDidMount() {
    this.props.subscribeToNewHealthMetrics();
  }

  public componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    // if the graphql query has not populated, update
    if (
      !this.props.data ||
      !nextProps.data ||
      !this.props.data.health ||
      !nextProps.data.health
    ) {
      return true;
    } else {
      const nextServerTime = new Date(nextProps.data.health.now);
      const lastServerTime = new Date(this.props.data.health.now);
      if (nextServerTime.getTime() - lastServerTime.getTime() > 0) {
        return true;
      }
      const newHeartbeatTime = nextState.timerHeartbeat;
      // if the server has not updated within 4 seconds, return true
      if (
        newHeartbeatTime.getTime() - lastServerTime.getTime() >
        WARN_SKEW_MS
      ) {
        return true;
      }
    }
    return false;
  }

  public render() {
    // tslint:disable-next-line
    // console.log(this.props);
    const {
      data = { loading: true, health: { version: "-1", now: new Date() } }
    } = this.props;
    const { loading, health } = data;

    const { timerHeartbeat } = this.state;
    let version = "ERR! SERVER DOWN";
    let serverNow = new Date(0);
    if (!loading && health) {
      version = health.version;
      serverNow = new Date(health.now);
    }
    const clientNow = timerHeartbeat < new Date() ? new Date() : timerHeartbeat;
    const skewMs = clientNow.getTime() - serverNow.getTime();

    return (
      <HealthContainer>
        <h1>UDIA</h1>
        <CenterParagraph>UDIA is the universal wildcard.</CenterParagraph>
        <CenterParagraph>
          It&apos;s listening to the unvierse dance with words and logic.
        </CenterParagraph>
        <h3>Health</h3>
        <dl>
          <ErrorableListTitle isWarn={loading} isErr={!loading && !health}>
            Application Version
          </ErrorableListTitle>
          <dd>
            <code>
              Client: {APP_VERSION + " "}
              <a
                href="https://github.com/udia-software/udia-client"
                target="_blank"
                rel="noopener noreferrer"
              >
                src
              </a>
            </code>
            <br />
            <code>
              Server: {(!loading ? version : "Loading...") + " "}
              <a
                href="https://github.com/udia-software/udia"
                target="_blank"
                rel="noopener noreferrer"
              >
                src
              </a>
            </code>
          </dd>
          <ErrorableListTitle
            isWarn={!loading && skewMs > WARN_SKEW_MS}
            isErr={!loading && skewMs > 10 * WARN_SKEW_MS}
          >
            Time{" "}
            {!loading
              ? `(skew ${skewMs}ms ${
                  skewMs > 10 * WARN_SKEW_MS
                    ? `ERR! > ${10 * WARN_SKEW_MS}ms`
                    : skewMs > WARN_SKEW_MS
                      ? `WARN! > ${WARN_SKEW_MS}ms`
                      : ""
                })`
              : ""}
          </ErrorableListTitle>
          <dd>
            <code>
              <span>Client: </span>
              {clientNow.toISOString()}
            </code>
            <br />
            <code>
              <span>Server: </span>
              {!loading ? serverNow.toISOString() : "Loading..."}
            </code>
          </dd>
        </dl>
        <CenterParagraph>
          It is I and You being one and inseperable.
        </CenterParagraph>
        <CenterParagraph>It is Understanding.</CenterParagraph>
        <h1>AI, DU</h1>
      </HealthContainer>
    );
  }

  private clientSecondTimer = () => {
    this.setState({ timerHeartbeat: new Date() });
  };
}

const HEALTH_METRIC_QUERY = gql`
  query HealthMetricQuery {
    health {
      version
      now
    }
  }
`;

const HEALTH_METRIC_SUBSCRIPTION = gql`
  subscription HealthMetricSubscription {
    health {
      version
      now
    }
  }
`;

interface IHealthResponseData {
  health: {
    version: string;
    now: number; // unix timestamp ms
  };
}

const withHealthSubscriptionData = graphql<IProps, IHealthResponseData, {}>(
  HEALTH_METRIC_QUERY,
  {
    props: props => {
      return {
        ...props,
        subscribeToNewHealthMetrics: () =>
          props.data!.subscribeToMore({
            document: HEALTH_METRIC_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => ({
              ...prev,
              ...subscriptionData.data
            })
          })
      };
    }
  }
);

export default withHealthSubscriptionData(Health);
