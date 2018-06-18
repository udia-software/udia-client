import gql from "graphql-tag";
import React, { Component } from "react";
import { DataValue, graphql, OperationVariables } from "react-apollo";
import { ThemedStyledProps } from "styled-components";
import { APP_VERSION } from "../Constants";
import CryptoManager, {
  IMasterKeyBuffers
} from "../Modules/Crypto/CryptoManager";
import styled, { IThemeInterface } from "./AppStyles";

const HealthContainer = styled.div`
  width: 100%;
  display: grid;
  place-content: center;
  place-items: center;
  dl > dt {
    padding-top: 0.5em;
    padding-left: 0.5em;
  }
`;

const CenterParagraph = styled.p`
  text-align: center;
`;

const ErrorableListTitle = styled.dt`
  text-decoration: underline;
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
  cryptoManager?: CryptoManager | false;
  randomValues?: Uint8Array | false;
  testSymEncKeyGen?: string | false;
  testAsymSignKeyGen?: string | false;
  testAsymEncKeyGen?: string | false;
  testConsistantKeyGen?: boolean;
}

const WARN_SKEW_MS = 4000;

class Health extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "Health - UDIA";
    this.state = {
      intervalId: setInterval(this.intervalCallback, 1000),
      timerHeartbeat: new Date()
    };
  }

  /**
   * once component mounts, perform a basic browser/server sanity check
   */
  public async componentDidMount() {
    this.props.subscribeToNewHealthMetrics();
    const cryptoManager = this.initCryptoManager();

    // do a quick smoke test on client webcrypto
    let cryptoOK = true;
    cryptoOK = cryptoOK && this.checkRandomValues(cryptoManager);
    cryptoOK = cryptoOK && (await this.checkGenSymEncKey(cryptoManager));
    cryptoOK = cryptoOK && (await this.checkGenAsymSignKey(cryptoManager));
    cryptoOK = cryptoOK && (await this.checkGenAsymEncKey(cryptoManager));
    cryptoOK = cryptoOK && (await this.checkDeriveMasterKeys(cryptoManager));
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
    const {
      data = { loading: true, health: { version: "-1", now: new Date() } }
    } = this.props;
    const { loading, health } = data;

    const {
      timerHeartbeat,
      cryptoManager,
      randomValues,
      testSymEncKeyGen,
      testAsymSignKeyGen,
      testAsymEncKeyGen,
      testConsistantKeyGen
    } = this.state;
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
              ? `(skew ${skewMs}ms${
                  skewMs > 10 * WARN_SKEW_MS
                    ? ` ERR! > ${10 * WARN_SKEW_MS}ms`
                    : skewMs > WARN_SKEW_MS
                      ? ` WARN! > ${WARN_SKEW_MS}ms`
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
        <h3>Crypto Sanity Check</h3>
        <dl>
          <ErrorableListTitle
            isWarn={typeof cryptoManager === "undefined"}
            isErr={typeof cryptoManager !== "undefined" && !cryptoManager}
          >
            Crypto &amp; Subtle Crypto
          </ErrorableListTitle>
          <dd>
            {typeof cryptoManager === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!cryptoManager ? !!cryptoManager : `ERR! ${!!cryptoManager}`
                }`}
          </dd>
          <ErrorableListTitle
            isWarn={typeof randomValues === "undefined"}
            isErr={typeof randomValues !== "undefined" && !randomValues}
          >
            globalCrypto.getRandomValues
          </ErrorableListTitle>
          <dd>
            {typeof randomValues === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!randomValues ? randomValues : `ERR! ${!!randomValues}`
                }`}
          </dd>
          <ErrorableListTitle
            isWarn={typeof testSymEncKeyGen === "undefined"}
            isErr={typeof testSymEncKeyGen !== "undefined" && !testSymEncKeyGen}
          >
            subtleCrypto.genKey AES-GCM 256
          </ErrorableListTitle>
          <dd
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              maxWidth: "24em"
            }}
          >
            {typeof testSymEncKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testSymEncKeyGen
                    ? testSymEncKeyGen
                    : `ERR! ${!!testSymEncKeyGen}`
                }`}
          </dd>
          <ErrorableListTitle
            isWarn={typeof testAsymSignKeyGen === "undefined"}
            isErr={
              typeof testAsymSignKeyGen !== "undefined" && !testAsymSignKeyGen
            }
          >
            subtleCrypto.genKey ECDSA P-521
          </ErrorableListTitle>
          <dd
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              maxWidth: "24em"
            }}
          >
            {typeof testAsymSignKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testAsymSignKeyGen
                    ? testAsymSignKeyGen
                    : `ERR! ${!!testAsymSignKeyGen}`
                }`}
          </dd>
          <ErrorableListTitle
            isWarn={typeof testAsymEncKeyGen === "undefined"}
            isErr={
              typeof testAsymEncKeyGen !== "undefined" && !testAsymEncKeyGen
            }
          >
            subtleCrypto.genKey RSA-OAEP EXP 3 MOD 4096 SHA-512
          </ErrorableListTitle>
          <dd
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              maxWidth: "24em"
            }}
          >
            {typeof testAsymEncKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testAsymEncKeyGen
                    ? testAsymEncKeyGen
                    : `ERR! ${!!testAsymEncKeyGen}`
                }`}
          </dd>
          <ErrorableListTitle
            isWarn={typeof testConsistantKeyGen === "undefined"}
            isErr={
              typeof testConsistantKeyGen !== "undefined" &&
              !testConsistantKeyGen
            }
          >
            deriveMasterKeys Consistent
          </ErrorableListTitle>
          <dd
            style={{
              wordBreak: "break-all",
              wordWrap: "break-word",
              maxWidth: "24em"
            }}
          >
            {typeof testConsistantKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testConsistantKeyGen
                    ? testConsistantKeyGen
                    : `ERR! ${!!testConsistantKeyGen}`
                }`}
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

  private intervalCallback = () => {
    this.setState({ timerHeartbeat: new Date() });
  };

  private initCryptoManager = () => {
    try {
      const cryptoManager = new CryptoManager();
      this.setState({ cryptoManager });
      return cryptoManager;
    } catch {
      this.setState({ cryptoManager: false });
    }
    return null;
  };

  private checkRandomValues = (
    cryptoManagerInstance?: CryptoManager | null
  ) => {
    let cryptoManager;
    if (cryptoManagerInstance) {
      cryptoManager = cryptoManagerInstance;
    } else {
      cryptoManager = this.state.cryptoManager;
    }
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        this.setState({
          randomValues: cryptoManager.getRandomValues(4)
        });
        return true;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        this.setState({ randomValues: false });
      }
    }
    return false;
  };

  private async checkGenSymEncKey(
    cryptoManagerInstance?: CryptoManager | null
  ) {
    let cryptoManager;
    if (cryptoManagerInstance) {
      cryptoManager = cryptoManagerInstance;
    } else {
      cryptoManager = this.state.cryptoManager;
    }
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        const symCryptoKey = await cryptoManager.generateSymmetricEncryptionKey();
        const exptJWK = await cryptoManager.exportJsonWebKey(symCryptoKey);
        this.setState({
          testSymEncKeyGen:
            JSON.stringify(exptJWK, null, 2).substr(0, 22) + "... }"
        });
        return true;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        this.setState({ testSymEncKeyGen: false });
      }
    }
    return false;
  }

  private async checkGenAsymSignKey(
    cryptoManagerInstance?: CryptoManager | null
  ) {
    let cryptoManager;
    if (cryptoManagerInstance) {
      cryptoManager = cryptoManagerInstance;
    } else {
      cryptoManager = this.state.cryptoManager;
    }
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        const asymCryptoKeyPair = await cryptoManager.generateAsymmetricSigningKeyPair();
        const exptJWK = await cryptoManager.exportJsonWebKey(
          asymCryptoKeyPair.publicKey
        );
        this.setState({
          testAsymSignKeyGen:
            JSON.stringify(exptJWK, null, 2).substr(0, 20) + "... }"
        });
        return true;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        this.setState({ testAsymSignKeyGen: false });
      }
    }
    return false;
  }

  private async checkGenAsymEncKey(
    cryptoManagerInstance?: CryptoManager | null
  ) {
    let cryptoManager;
    if (cryptoManagerInstance) {
      cryptoManager = cryptoManagerInstance;
    } else {
      cryptoManager = this.state.cryptoManager;
    }
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        const asymCryptoKeyPair = await cryptoManager.generateAsymmetricEncryptionKeyPair();
        const exptJWK = await cryptoManager.exportJsonWebKey(
          asymCryptoKeyPair.publicKey
        );
        this.setState({
          testAsymEncKeyGen:
            JSON.stringify(exptJWK, null, 2).substr(0, 28) + "... }"
        });
        return true;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        this.setState({ testAsymEncKeyGen: false });
      }
    }
    return false;
  }

  private async checkDeriveMasterKeys(
    cryptoManagerInstance?: CryptoManager | null
  ) {
    let cryptoManager;
    if (cryptoManagerInstance) {
      cryptoManager = cryptoManagerInstance;
    } else {
      cryptoManager = this.state.cryptoManager;
    }
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      const REFERENCE: IMasterKeyBuffers = JSON.parse(
        `{
          "pw":{
            "type":"Buffer",
            "data":[165,193,186,97,141,236,247,112,132,190,220,10,40,53,173,84,188,14,85,148,201,50,221,254,250,62,90,
              52,4,185,26,255,83,146,175,64,65,248,174,229,181,86,180,124,251,138,77,212,151,138,65,65,227,12,84,190,
              234,5,116,90,99,0,218,153,219,13,198,19,17,131,135,220,211,174,51,238,57,254,89,173,203,19,72,61,244,53,
              9,205,251,33,72,159,144,175,243,225,40,220,223,205,123,5,172,213,25,182,98,47,128,135,54,192,244,240,99,
              68,145,135,187,254,26,206,66,72,158,162,182,251,253,78,159,98,226,0,190,70,223,36,123,215,249,36,198,244,
              34,125,36,186,144,18,215,75,253,60,100,192,245,23,14,72,24,213,69,118,217,108,60,21,99,59,68,172,107,102,
              95,208,90,114,155,119,107,31,66,116,26,101,228,149,99,186,60,227,108,132,183,43,92,110,247,253,25,100,
              140,164,208,223,120,53,202,33,160,125,48,13,189,56,165,80,42,191,172,136,125,198,211,0,239,155,135,234,
              120,9,185,251,30,39,50,66,110,71,203,126,114,174,181,150,3,217,45,130,161,69,158,175,218,0]
            },
          "mk":{
            "type":"Buffer",
            "data":[250,140,238,66,144,72,133,120,171,130,189,249,18,169,222,129,105,99,153,99,61,181,182,70,176,229,
              110,31,14,77,19,27,35,24,251,120,59,90,74,158,110,94,90,171,58,22,212,74,71,147,65,56,58,3,93,234,4,162,
              116,65,114,15,193,99,250,82,236,159,135,224,180,128,130,39,228,95,241,143,29,163,229,216,83,55,92,82,34,
              134,83,7,170,47,156,148,248,81,1,205,186,99,137,157,251,131,135,64,247,200,121,198,103,118,166,173,239,
              44,233,178,239,157,23,17,185,14,94,89,18,240,114,23,173,136,18,121,124,121,43,214,55,156,165,233,251,58,
              60,53,128,187,109,186,10,179,190,79,98,84,5,222,99,174,35,35,75,152,142,63,121,148,205,113,129,41,164,17,
              253,47,122,20,152,114,72,156,72,57,244,210,20,13,44,126,39,243,8,4,208,96,147,46,161,53,89,242,2,230,234,
              145,166,118,250,77,226,32,2,54,49,75,74,170,116,197,112,227,115,223,186,53,92,140,161,76,65,51,22,226,
              161,51,86,233,187,65,100,186,204,253,106,95,218,175,211,169,174,172,42,0,203,92]
            },
          "ak":{
            "type":"Buffer",
            "data":[116,173,152,230,226,191,37,25,222,115,224,136,169,121,206,51,232,226,49,67,211,205,209,67,230,15,
              14,99,179,32,155,52,198,228,136,126,250,144,172,173,179,92,106,64,62,55,208,236,194,189,148,154,172,176,
              207,217,190,7,214,57,208,92,238,252,83,80,39,179,161,89,75,227,72,243,254,40,218,139,45,104,79,74,22,56,
              87,148,250,31,150,132,226,249,73,182,112,253,12,53,167,204,128,134,96,45,98,20,112,86,189,60,246,149,103,
              16,39,77,61,115,255,208,162,132,178,240,194,182,191,84,146,248,137,79,245,19,106,109,11,103,3,153,147,
              206,207,87,183,75,113,74,5,4,43,75,241,9,169,254,86,183,202,98,87,120,30,58,84,82,197,210,148,117,85,105,
              60,133,105,217,239,17,6,133,226,227,171,37,215,49,149,247,244,227,48,77,176,181,42,23,14,81,198,136,234,
              115,77,15,121,123,209,209,179,247,156,57,250,242,40,111,235,86,170,149,178,243,152,49,254,140,89,104,64,
              92,32,250,159,46,137,195,180,219,77,35,153,192,140,210,76,175,34,210,6,20,49,227,100,148,28,35]
            },
          "pwNonce":{
            "type":"Buffer",
            "data":[22,237,67,218,92,122,117,14,194,174,112,90,151,237,199,144,254,208,27,153,247,190,222,32,101,88,
              155,71,161,87,190,37,128,12,68,12,39,75,28,104,27,230,79,183,242,133,117,55,251,215,14,44,179,146,4,220,
              129,175,68,147,236,126,99,57,169,153,85,211,70,170,149,155,189,220,26,89,21,121,82,87,14,123,132,200,92,
              249,69,2,8,89,226,204,100,96,15,34,225,194,110,82,170,77,8,80,94,18,13,59,130,126,49,218,142,5,179,92,
              146,124,41,12,154,236,244,216,63,18,8,118]
          },
          "pwCost":100000,
          "pwKeySize":768,
          "pwDigest":"SHA-512",
          "pwFunc":"PBKDF2"
        }`
      );
      try {
        const dummyInputs = {
          userInputtedPassword: "!~@#$%^F7DBYjlkjsdf923+=;HUR",
          pwNonce:
            "Fu1D2lx6dQ7CrnBal+3HkP7QG5n3vt4gZVibR6FXviWADEQMJ0scaBvmT7fyhXU3+9cOLLOSBNyBr0ST7H5jOamZVdNGqpWbv" +
            "dwaWRV5UlcOe4TIXPlFAghZ4sxkYA8i4cJuUqpNCFBeEg07gn4x2o4Fs1ySfCkMmuz02D8SCHY="
        };
        const output = await cryptoManager.deriveMasterKeyBuffers(dummyInputs);

        let ok = true;
        ok = ok && Buffer.from(output.ak).equals(Buffer.from(REFERENCE.ak));
        ok = ok && Buffer.from(output.mk).equals(Buffer.from(REFERENCE.mk));
        ok = ok && Buffer.from(output.pw).equals(Buffer.from(REFERENCE.pw));
        ok =
          ok &&
          Buffer.from(output.pwNonce).equals(Buffer.from(REFERENCE.pwNonce));

        this.setState({ testConsistantKeyGen: ok });
        return ok;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        this.setState({ testConsistantKeyGen: false });
      }
    }
    return false;
  }
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
