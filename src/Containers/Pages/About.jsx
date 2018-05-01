import gql from "graphql-tag";
import React, { Component } from "react";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import { utc } from "moment";

import { CenterContainer } from "../../Components/Styled";
import { authSelectors } from "../../Modules/Auth";

const MOMENT_FORMAT_STRING = "MMMM D YYYY, h:mm:ss SSS a ZZ";

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
      clientNow: utc()
    }
  }

  timer = () => {
    this.setState({ clientNow: utc() });
  }

  componentDidMount() {
    this.props.subscribeToNewHealthMetrics();
    this.setState({ intervalId: setInterval(this.timer, 1000) })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    document.title = "About - UDIA";
    const { healthMetricQuery, username } = this.props;
    const { now, version } = healthMetricQuery.healthMetric || {};
    const serverNow = utc(now);
    const delayClientNow = this.state.clientNow;
    let clientNow = utc();
    if (clientNow < delayClientNow) {
      clientNow = delayClientNow
    }
    const skew = clientNow.diff(serverNow, "milliseconds");
    return (
      <CenterContainer>
        <h1>UDIA</h1>
        <p>UDIA is the universal wildcard.</p>
        <p>It's listening to the universe dance with words and logic.</p>
        <dl>
          <dt>Application Version</dt>
          <dd><pre>Server: {version}</pre></dd>
          <dt>Server Time {(Math.abs(skew) > 60000 || !now) && <span>(ERR! Is server down?!)</span>}</dt>
          <dd><pre>{serverNow.format(MOMENT_FORMAT_STRING)}</pre></dd>
          <dt>Client Time (skew {skew}ms)</dt>
          <dd><pre>{clientNow.format(MOMENT_FORMAT_STRING)}</pre></dd>
          <dt>User</dt>
          <dd>{username && <pre>{username}</pre>}
            {!username && <span>Unauthenticated</span>}</dd>
        </dl>
        <p>It is I and You being one and inseperable.</p>
        <p>It is Understanding.</p>
        <h1>AI, DU</h1>
      </CenterContainer>
    );
  }
};

function mapStateToProps(state) {
  return {
    username: authSelectors.getSelfUsername(state)
  }
}

const HEALTH_METRIC_QUERY = gql`
  query healthMetricQuery {
    healthMetric {
      version
      now  
    }
  }
`;

const HEALTH_METRIC_SUBSCRIPTION = gql`
  subscription healthMetricSubscription {
    HealthMetricSubscription {
      version
      now
    }
  }
`;

const withData = graphql(HEALTH_METRIC_QUERY, {
  name: "healthMetricQuery",
  props: props => {
    return {
      ...props,
      subscribeToNewHealthMetrics: params => {
        console.log("Subscribing to Metrics")
        return props.healthMetricQuery.subscribeToMore({
          document: HEALTH_METRIC_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const newMetricItem = subscriptionData.data.HealthMetricSubscription;
            return Object.assign({}, prev, {
              healthMetric: newMetricItem
            });
          }
        })
      }
    }
  }
});

const About = connect(mapStateToProps)(withData(AboutPage));

export { About };
export default About;
