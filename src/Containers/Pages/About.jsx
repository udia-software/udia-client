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
  clientNow: Moment,
};

class AboutPage extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: setInterval(this.timer, 1000),
      clientNow: utc(),
    };
  }

  componentDidMount() {
    this.props.subscribeToNewHealthMetrics();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer = () => {
    this.setState({ clientNow: utc() });
  };

  render() {
    document.title = 'About - UDIA';
    const { healthMetricQuery, username } = this.props;
    const { now, version } = healthMetricQuery.health || {};
    const serverNow = utc(now);
    const delayClientNow = this.state.clientNow;
    let clientNow = utc();
    if (clientNow < delayClientNow) {
      clientNow = delayClientNow;
    }
    const skew = clientNow.diff(serverNow, 'milliseconds');
    return (
      <CenterContainer>
        <h1>UDIA</h1>
        <p>UDIA is the universal wildcard.</p>
        <p>It&apos;s listening to the universe dance with words and logic.</p>
        <dl>
          <dt>Application Version</dt>
          <dd>
            <pre>Client: {clientVersion}</pre>
            <pre>Server: {version}</pre>
          </dd>
          <dt>
            Server Time {(Math.abs(skew) > 60000 || !now) && <span>(ERR! Is server down?!)</span>}
          </dt>
          <dd>
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

const withData = graphql(HEALTH_METRIC_QUERY, {
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

export default connect(mapStateToProps)(withData(AboutPage));
