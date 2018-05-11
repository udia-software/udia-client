// @flow
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import type Moment from 'moment';
import { utc } from 'moment';
import { version as clientVersion } from '../../../package.json';

import { CenterContainer } from '../../Components/Styled';
import { AuthSelectors } from '../../Modules/Auth';

const MOMENT_FORMAT_STRING = 'MMMM D YYYY, h:mm:ss SSS a ZZ';

type Props = {
  username: string,
  subscribeToNewHealthMetrics: Function,
  healthMetricQuery: Function,
};

type State = {
  intervalId: any,
  timerHeartbeat: Moment,
};

class AboutPage extends Component<Props, State> {
  constructor(props) {
    super(props);
    document.title = 'About - UDIA';
    this.state = {
      intervalId: setInterval(this.timer, 1000),
      timerHeartbeat: utc().local(),
    };
  }

  componentDidMount() {
    this.props.subscribeToNewHealthMetrics();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If the healthMetricQuery value is falsy, we should update.
    if (!this.props.healthMetricQuery.health) {
      return true;
    }
    const oldServerMS = (this.props.healthMetricQuery.health || {}).now;
    const newServerMS = (nextProps.healthMetricQuery.health || {}).now;
    // If the server time changed, we should update
    if (newServerMS - oldServerMS > 0) {
      return true;
    }
    const oldServerTime = utc(oldServerMS).local();
    // If the heartbeat time is over four seconds greater than the server time, we should update
    const newHeartbeatTime = nextState.timerHeartbeat;
    if (newHeartbeatTime.diff(oldServerTime, 'seconds') > 4) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer = () => {
    this.setState({ timerHeartbeat: utc().local() });
  };

  render() {
    const { healthMetricQuery, username } = this.props;
    const { timerHeartbeat } = this.state;
    const { loading } = healthMetricQuery;
    const { now, version } = healthMetricQuery.health || {};
    let serverNow = utc(now || 0).local();
    let clientNow = utc().local();
    const skew = clientNow.diff(serverNow, 'milliseconds');
    let serverDown = false;
    if (!loading && timerHeartbeat.diff(serverNow, 'seconds') > 4) {
      clientNow = timerHeartbeat;
      serverDown = true;
    }
    if (loading) {
      serverNow = clientNow;
    }
    return (
      <CenterContainer>
        <h1>UDIA</h1>
        <p>UDIA is the universal wildcard.</p>
        <p>It&apos;s listening to the universe dance with words and logic.</p>
        <dl>
          <dt>Application Version</dt>
          <dd>
            <pre>
              Client: {clientVersion}{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/udia-software/udia-client"
              >
                src
              </a>
            </pre>
            <pre>
              Server: {version || 'Connecting...'}{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/udia-software/udia"
              >
                src
              </a>
            </pre>
          </dd>
          <dt style={{ color: serverDown ? 'red' : undefined }}>
            Server Time{serverDown && ' (ERR Server Down)'}
          </dt>
          <dd style={{ color: serverDown ? 'red' : undefined }}>
            <pre>{serverNow.format(MOMENT_FORMAT_STRING)}</pre>
          </dd>
          <dt>Client Time (skew {skew}ms)</dt>
          <dd>
            <pre>{clientNow.format(MOMENT_FORMAT_STRING)}</pre>
          </dd>
          <dt>User</dt>
          <dd>
            {username && <pre>{username}</pre>}
            {!username && <span>Unauthenticated</span>}
          </dd>
        </dl>
        <p>It is I and You being one and inseperable.</p>
        <p>It is Understanding.</p>
        <h1>AI, DU</h1>
      </CenterContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: AuthSelectors.getSelfUsername(state),
  };
}

const HEALTH_METRIC_QUERY = gql`
  query healthMetricQuery {
    health {
      version
      now
    }
  }
`;

const HEALTH_METRIC_SUBSCRIPTION = gql`
  subscription healthMetricSubscription {
    health {
      version
      now
    }
  }
`;

const withSubscriptionData = graphql(HEALTH_METRIC_QUERY, {
  name: 'healthMetricQuery',
  props: props => ({
    ...props,
    subscribeToNewHealthMetrics: () =>
      props.healthMetricQuery.subscribeToMore({
        document: HEALTH_METRIC_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => ({ ...prev, ...subscriptionData.data }),
      }),
  }),
});

export default connect(mapStateToProps)(withSubscriptionData(AboutPage));
