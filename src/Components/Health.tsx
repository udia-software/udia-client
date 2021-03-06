/**
 * This is a kludgy class to quickly make sure all the web crypto API calls I make do what I expect, more or less
 */
import gql from "graphql-tag";
import React, { Component, MouseEventHandler } from "react";
import { DataValue, graphql, OperationVariables } from "react-apollo";
import { ThemedStyledProps } from "styled-components";
import { APP_VERSION } from "../Constants";
import CryptoManager, {
  IMasterKeyBuffers
} from "../Modules/Crypto/CryptoManager";
import styled, { IThemeInterface } from "./AppStyles";
import { Button } from "./Helpers/Button";
import { ThemedAnchor } from "./Helpers/ThemedLinkAnchor";

const HealthContainer = styled.div`
  width: 100%;
  display: grid;
  place-content: center;
  align-items: center;
  justify-items: center;
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
    props.isErr
      ? props.theme.red
      : props.isWarn
        ? props.theme.yellow
        : props.theme.primaryColor};
`;

const SuccessableListDescription = styled.dd`
  color: ${(
    props: ThemedStyledProps<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
      IThemeInterface
    > & { isOK?: boolean }
  ) => (props.isOK ? props.theme.green : props.theme.primaryColor)};
`;

interface IProps {
  HealthMetricQuery: () => any;
  subscribeToNewHealthMetrics: () => any;
  data?: DataValue<IHealthResponseData, OperationVariables>;
}

interface IState {
  intervalId: any;
  timerHeartbeat: Date;
  forceReloadInterval?: number;
  forceReloadBypassCache?: number;
  cryptoManager?: CryptoManager | false;
  randomValues?: Uint8Array | false;
  testSymEncKeyGen?: string | false;
  testAsymSignKeyGen?: string | false;
  testAsymEncKeyGen?: string | false;
  testConsistantKeyGen?: boolean;
  testEncryptDecrypt?: boolean;
  testExportImportSecKey?: string | false;
  testExportImportSignKeyPair?: boolean;
}

const WARN_SKEW_MS = 4000;

class Health extends Component<IProps, IState> {
  private isMountableMounted: boolean;

  constructor(props: IProps) {
    super(props);
    document.title = "Health - UDIA";
    this.isMountableMounted = false;
    this.state = {
      intervalId: setInterval(this.intervalCallback, 1000),
      timerHeartbeat: new Date()
    };
  }

  /**
   * once component mounts, perform a basic browser/server sanity check
   */
  public async componentDidMount() {
    window.scrollTo(0, 0);
    this.isMountableMounted = true;
    this.props.subscribeToNewHealthMetrics();
    const cryptoManager = this.initCryptoManager();

    // do a quick smoke test on client webcrypto keygen
    let cryptoOK = true;
    cryptoOK = cryptoOK && this.checkRandomValues(cryptoManager);
    cryptoOK = cryptoOK && (await this.checkGenSymEncKey(cryptoManager));
    cryptoOK = cryptoOK && (await this.checkGenAsymSignKey(cryptoManager));
    cryptoOK = cryptoOK && (await this.checkGenAsymEncKey(cryptoManager));
    cryptoOK = cryptoOK && (await this.checkDeriveMasterKeys(cryptoManager));

    // quick encrypt/decrypt test
    const payload = "whatever, bruh";
    const secret = Buffer.from(
      `Y5hXm6XSRE++oAEH20ZwJhvZ/HH5MW8mtXU15KaFsd0jdozdqPSQOLAiSQLnh9C` +
        `cE7S9hZsRrgek8fSrdNxvUWrMcNRGz/QKOIs8s4i1Gas6brIcKQ==`,
      "base64"
    ).buffer;
    const output = await this.checkEncryptWithSecret(
      cryptoManager,
      payload,
      secret
    );
    let encryptDecrypt = false;
    if (output) {
      const decryptOutput = await this.checkDecryptWithSecret(
        cryptoManager,
        output,
        secret
      );

      if (decryptOutput === payload) {
        encryptDecrypt = true;
      }
    }
    cryptoOK = cryptoOK && encryptDecrypt;
    if (this.isMountableMounted) {
      this.setState({ testEncryptDecrypt: encryptDecrypt });
    }

    // verify export key functionality
    if (cryptoOK && cryptoManager) {
      const masterBufs = await cryptoManager.deriveMasterKeyBuffers({
        userInputtedPassword: "UDIAtest48!@uip"
      });
      cryptoOK =
        cryptoOK &&
        (await this.checkExportImportSecKey(masterBufs, cryptoManager));
      cryptoOK =
        cryptoOK &&
        (await this.checkExportImportSignKeyPair(masterBufs, cryptoManager));
    }
  }

  public componentWillUnmount() {
    this.isMountableMounted = false;
    clearInterval(this.state.intervalId);
    clearInterval(this.state.forceReloadInterval);
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
      forceReloadBypassCache,
      cryptoManager,
      randomValues,
      testSymEncKeyGen,
      testAsymSignKeyGen,
      testAsymEncKeyGen,
      testConsistantKeyGen,
      testEncryptDecrypt,
      testExportImportSecKey,
      testExportImportSignKeyPair
    } = this.state;
    let version = "ERR! CONNECTION_DOWN";
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
          It&apos;s listening to the universe dance with words and logic.
        </CenterParagraph>
        <h3>Health</h3>
        <dl>
          <ErrorableListTitle isWarn={loading} isErr={!loading && !health}>
            Application Version
          </ErrorableListTitle>
          <SuccessableListDescription>
            <code>
              Client: {APP_VERSION + " "}
              <ThemedAnchor
                href="https://github.com/udia-software/udia-client"
                target="_blank"
                rel="noopener noreferrer"
              >
                src
              </ThemedAnchor>
            </code>
            <br />
            <code>
              Server: {(!loading ? version : "Loading...") + " "}
              <ThemedAnchor
                href="https://github.com/udia-software/udia"
                target="_blank"
                rel="noopener noreferrer"
              >
                src
              </ThemedAnchor>
            </code>
          </SuccessableListDescription>
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
          <SuccessableListDescription>
            <code>
              <span>Client: </span>
              {clientNow.toISOString()}
            </code>
            <br />
            <code>
              <span>Server: </span>
              {!loading ? serverNow.toISOString() : "Loading..."}
            </code>
          </SuccessableListDescription>
        </dl>
        <Button
          disabled={(forceReloadBypassCache || -1) > 0}
          onClick={this.handleForceReload}
        >
          {forceReloadBypassCache === undefined
            ? "Force Reload Bypass Cache"
            : forceReloadBypassCache > 0
              ? `CONFIRM? (WAIT ${forceReloadBypassCache}s)`
              : "CONFIRM FORCE RELOAD NO CACHE"}
        </Button>
        <h3>Crypto Sanity Check</h3>
        <dl>
          <ErrorableListTitle
            isWarn={typeof cryptoManager === "undefined"}
            isErr={typeof cryptoManager !== "undefined" && !cryptoManager}
          >
            check Crypto &amp; Subtle Crypto
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!cryptoManager}>
            {typeof cryptoManager === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!cryptoManager
                    ? `OK ${!!cryptoManager}`
                    : `ERR! ${!!cryptoManager}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof randomValues === "undefined"}
            isErr={typeof randomValues !== "undefined" && !randomValues}
          >
            globalCrypto.getRandomValues
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!randomValues}>
            {typeof randomValues === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!randomValues
                    ? `OK ${randomValues}`
                    : `ERR! ${!!randomValues}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof testSymEncKeyGen === "undefined"}
            isErr={typeof testSymEncKeyGen !== "undefined" && !testSymEncKeyGen}
          >
            subtleCrypto.genKey AES-GCM 256
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!testSymEncKeyGen}>
            {typeof testSymEncKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testSymEncKeyGen
                    ? `OK ${testSymEncKeyGen}`
                    : `ERR! ${!!testSymEncKeyGen}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof testAsymSignKeyGen === "undefined"}
            isErr={
              typeof testAsymSignKeyGen !== "undefined" && !testAsymSignKeyGen
            }
          >
            subtleCrypto.genKey ECDSA P-521
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!testAsymSignKeyGen}>
            {typeof testAsymSignKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testAsymSignKeyGen
                    ? `OK ${testAsymSignKeyGen}`
                    : `ERR! ${!!testAsymSignKeyGen}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof testAsymEncKeyGen === "undefined"}
            isErr={
              typeof testAsymEncKeyGen !== "undefined" && !testAsymEncKeyGen
            }
          >
            subtleCrypto.genKey RSA-OAEP EXP 3 MOD 4096 SHA-512
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!testAsymEncKeyGen}>
            {typeof testAsymEncKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testAsymEncKeyGen
                    ? `OK ${testAsymEncKeyGen}`
                    : `ERR! ${!!testAsymEncKeyGen}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof testConsistantKeyGen === "undefined"}
            isErr={
              typeof testConsistantKeyGen !== "undefined" &&
              !testConsistantKeyGen
            }
          >
            check deriveMasterKeys consistent
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!testConsistantKeyGen}>
            {typeof testConsistantKeyGen === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testConsistantKeyGen
                    ? `OK ${testConsistantKeyGen}`
                    : `ERR! ${!!testConsistantKeyGen}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof testEncryptDecrypt === "undefined"}
            isErr={
              typeof testEncryptDecrypt !== "undefined" && !testEncryptDecrypt
            }
          >
            check Encrypt/Decrypt with secret
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!testEncryptDecrypt}>
            {typeof testEncryptDecrypt === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testEncryptDecrypt
                    ? `OK ${testEncryptDecrypt}`
                    : `ERR! ${!!testEncryptDecrypt}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof testExportImportSecKey === "undefined"}
            isErr={
              typeof testExportImportSecKey !== "undefined" &&
              !testExportImportSecKey
            }
          >
            check Export→Crypt→Import→Test Enc|Dec Key
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!testExportImportSecKey}>
            {typeof testExportImportSecKey === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testExportImportSecKey
                    ? `OK ${testExportImportSecKey}`
                    : `ERR! ${!!testExportImportSecKey}`
                }`}
          </SuccessableListDescription>
          <ErrorableListTitle
            isWarn={typeof testExportImportSignKeyPair === "undefined"}
            isErr={
              typeof testExportImportSignKeyPair !== "undefined" &&
              !testExportImportSignKeyPair
            }
          >
            check Export→Crypt→Import→Test Sign|Ver KeyPair
          </ErrorableListTitle>
          <SuccessableListDescription isOK={!!testExportImportSignKeyPair}>
            {typeof testExportImportSignKeyPair === "undefined"
              ? "Loading..."
              : `CHECK: ${
                  !!testExportImportSignKeyPair
                    ? `OK ${testExportImportSignKeyPair}`
                    : `ERR! ${!!testExportImportSignKeyPair}`
                }`}
          </SuccessableListDescription>
        </dl>
        <CenterParagraph>
          It is I and You being one and inseperable.
        </CenterParagraph>
        <CenterParagraph>It is Understanding.</CenterParagraph>
        <h1>AI, DU</h1>
      </HealthContainer>
    );
  }

  protected handleForceReload: MouseEventHandler<HTMLButtonElement> = () => {
    const { forceReloadBypassCache } = this.state;
    if (forceReloadBypassCache === undefined) {
      this.setState({
        forceReloadBypassCache: 6,
        forceReloadInterval: window.setInterval(() => {
          const countdown = (this.state.forceReloadBypassCache || 6) - 1;
          this.setState({
            forceReloadBypassCache: countdown
          });
          if (countdown <= 0) {
            clearInterval(this.state.forceReloadInterval);
          }
        }, 1000)
      });
    } else if (forceReloadBypassCache <= 0) {
      window.location.reload(true);
    }
  };

  private intervalCallback = () => {
    if (this.isMountableMounted) {
      this.setState({ timerHeartbeat: new Date() });
    }
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
    const cryptoManager = cryptoManagerInstance
      ? cryptoManagerInstance
      : this.state.cryptoManager;
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
    const cryptoManager = cryptoManagerInstance
      ? cryptoManagerInstance
      : this.state.cryptoManager;
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        const symCryptoKey = await cryptoManager.generateSymmetricEncryptionKey();
        const exptJWK = await cryptoManager.exportJsonWebKey(symCryptoKey);
        if (this.isMountableMounted) {
          this.setState({
            testSymEncKeyGen:
              JSON.stringify(exptJWK, null, 2).substr(0, 22) + "... }"
          });
        }
        return true;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        if (this.isMountableMounted) {
          this.setState({ testSymEncKeyGen: false });
        }
      }
    }
    return false;
  }

  private async checkGenAsymSignKey(
    cryptoManagerInstance?: CryptoManager | null
  ) {
    const cryptoManager = cryptoManagerInstance
      ? cryptoManagerInstance
      : this.state.cryptoManager;
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        const asymCryptoKeyPair = await cryptoManager.generateAsymmetricSigningKeyPair();
        const exptJWK = await cryptoManager.exportJsonWebKey(
          asymCryptoKeyPair.publicKey
        );
        if (this.isMountableMounted) {
          this.setState({
            testAsymSignKeyGen:
              JSON.stringify(exptJWK, null, 2).substr(0, 20) + "... }"
          });
        }
        return true;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        if (this.isMountableMounted) {
          this.setState({ testAsymSignKeyGen: false });
        }
      }
    }
    return false;
  }

  private async checkGenAsymEncKey(
    cryptoManagerInstance?: CryptoManager | null
  ) {
    const cryptoManager = cryptoManagerInstance
      ? cryptoManagerInstance
      : this.state.cryptoManager;
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        const asymCryptoKeyPair = await cryptoManager.generateAsymmetricEncryptionKeyPair();
        const exptJWK = await cryptoManager.exportJsonWebKey(
          asymCryptoKeyPair.publicKey
        );
        if (this.isMountableMounted) {
          this.setState({
            testAsymEncKeyGen:
              JSON.stringify(exptJWK, null, 2).substr(0, 28) + "... }"
          });
        }
        return true;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        if (this.isMountableMounted) {
          this.setState({ testAsymEncKeyGen: false });
        }
      }
    }
    return false;
  }

  private async checkEncryptWithSecret(
    cryptoManagerInstance: CryptoManager | null,
    payload: string,
    secret: ArrayBuffer
  ) {
    let cryptoManager;
    if (cryptoManagerInstance) {
      cryptoManager = cryptoManagerInstance;
    }
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        return await cryptoManager.encryptWithSecret(
          Buffer.from(payload).buffer,
          secret
        );
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    }
    return false;
  }

  private async checkDecryptWithSecret(
    cryptoManagerInstance: CryptoManager | null,
    payload: string,
    secret: ArrayBuffer
  ) {
    let cryptoManager;
    if (cryptoManagerInstance) {
      cryptoManager = cryptoManagerInstance;
    }
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        const outputBuf = await cryptoManager.decryptWithSecret(
          payload,
          secret
        );
        return Buffer.from(outputBuf).toString();
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    }
    return false;
  }

  private async checkDeriveMasterKeys(
    cryptoManagerInstance?: CryptoManager | null
  ) {
    const cryptoManager = cryptoManagerInstance
      ? cryptoManagerInstance
      : this.state.cryptoManager;
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      // quick smoke test to verify general case master key derivation success
      const TEST_UIP = "!~@#$%^F7DBYj {$} \\lkjsdf923+=;HUR";
      const TEST_NONCE =
        `Fu1D2lx6dQ7CrnBal+3HkP7QG5n3vt4gZVibR6FXviWADEQMJ0scaBvmT7fyhXU3+9cOLLOSBNyBr0ST7H5jOamZVdN` +
        `GqpWbvdwaWRV5UlcOe4TIXPlFAghZ4sxkYA8i4cJuUqpNCFBeEg07gn4x2o4Fs1ySfCkMmuz02D8SCHY=`;
      const REFERENCE_AK =
        `V3fArme1PwobGkEfEOvzYQhe3utaJ/a0mDeKo49TpXL195eMCsqIPaXxpDMbWOtQx7eOdjR+I2TjLJyPZQPLwF46` +
        `/EHdfnbOymNH1yMNCK9H0+nOBg==`;
      const REFERENCE_MK =
        `C2ZSujyX7nO5x4i4aRcIkJ26JgqoJd/26DCjO+AO24HXoCabZNwYmKUOyTPp+TxARam1sL06tb80IilSFbCiohn+` +
        `/1MLleasoXi+WJUYFs1IekxMTQ==`;
      const REFERENCE_PW =
        `RJq0gPJLvmDSj3S/KFu9MnoTAeK+va/iR0d9XHQWAWWEuQFmEs60dTkLh1sLipk57cI0o5kfWihaZcU0WiPyB3mu` +
        `0vR2qhyfAsejezR5Qbi7O5l8JQ==`;
      try {
        const dummyInputs = {
          userInputtedPassword: TEST_UIP,
          pwNonce: TEST_NONCE
        };
        const output = await cryptoManager.deriveMasterKeyBuffers(dummyInputs);

        let ok = true;
        ok =
          ok &&
          Buffer.from(output.ak).equals(Buffer.from(REFERENCE_AK, "base64"));
        ok =
          ok &&
          Buffer.from(output.mk).equals(Buffer.from(REFERENCE_MK, "base64"));
        ok =
          ok &&
          Buffer.from(output.pw).equals(Buffer.from(REFERENCE_PW, "base64"));
        ok =
          ok &&
          Buffer.from(output.pwNonce).equals(Buffer.from(TEST_NONCE, "base64"));

        if (this.isMountableMounted) {
          this.setState({ testConsistantKeyGen: ok });
        }
        return ok;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error("ERR deriveMasterKeyBuffers", err);
        if (this.isMountableMounted) {
          this.setState({ testConsistantKeyGen: false });
        }
      }
    }
    return false;
  }

  private checkExportImportSecKey = async (
    masterBufs: IMasterKeyBuffers,
    cryptoManagerInstance?: CryptoManager | null
  ) => {
    const cryptoManager = cryptoManagerInstance
      ? cryptoManagerInstance
      : this.state.cryptoManager;
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        let ok = true;
        // Export
        const { mk, ak } = masterBufs;
        const mkBuf = Buffer.from(mk);
        const akBuf = Buffer.from(ak);
        const secretKey = await cryptoManager.generateSymmetricEncryptionKey();
        const secretJWK = await cryptoManager.exportJsonWebKey(secretKey);
        const serializedSecretJWK = JSON.stringify(secretJWK);
        const secretKeyBuf = Buffer.from(serializedSecretJWK, "utf8").buffer;
        // Encrypt/Decrypt
        const secretKeySecret = Buffer.concat([mkBuf, akBuf]).buffer;
        const encSecretKey = await cryptoManager.encryptWithSecret(
          secretKeyBuf,
          secretKeySecret
        );
        const decryptedSecretKeyBuf = await cryptoManager.decryptWithSecret(
          encSecretKey,
          secretKeySecret
        );
        ok =
          ok &&
          Buffer.from(secretKeyBuf).equals(Buffer.from(decryptedSecretKeyBuf));

        // Import & Verification
        const decryptedSerializedSecretJWK = Buffer.from(
          decryptedSecretKeyBuf
        ).toString("utf8");
        const decryptedSecretJWK = JSON.parse(decryptedSerializedSecretJWK);
        const regendSecretKey = await cryptoManager.importSecretJsonWebKey(
          decryptedSecretJWK
        );
        const testData = cryptoManager.getRandomValues(32).buffer;
        const genCryptOut = await cryptoManager.encryptWithSecretKey(
          testData,
          regendSecretKey
        );
        const refTestData = await cryptoManager.decryptWithSecretKey(
          genCryptOut,
          secretKey
        );
        ok = ok && Buffer.from(refTestData).equals(Buffer.from(testData));

        if (this.isMountableMounted) {
          this.setState({
            testExportImportSecKey:
              ok &&
              Buffer.from(testData)
                .toString("base64")
                .substr(0, 10)
          });
        }
        return ok;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error("ERR exportSymKey", err);
        if (this.isMountableMounted) {
          this.setState({ testExportImportSecKey: false });
        }
      }
    }
    return false;
  };

  private checkExportImportSignKeyPair = async (
    masterBufs: IMasterKeyBuffers,
    cryptoManagerInstance?: CryptoManager | null
  ) => {
    const cryptoManager = cryptoManagerInstance
      ? cryptoManagerInstance
      : this.state.cryptoManager;
    if (typeof cryptoManager !== "boolean" && cryptoManager) {
      try {
        let ok = true;

        // Export
        const { ak } = masterBufs;
        const signKeyPair = await cryptoManager.generateAsymmetricSigningKeyPair();
        const pubVerifyJWK = await cryptoManager.exportJsonWebKey(
          signKeyPair.publicKey
        );
        const serializedPubVerifyKey = JSON.stringify(pubVerifyJWK);
        ok = ok && !!serializedPubVerifyKey;
        const privSignJWK = await cryptoManager.exportJsonWebKey(
          signKeyPair.privateKey
        );
        const serializedPrivSignJWK = JSON.stringify(privSignJWK);

        // Encrypt
        const encPrivSignKey = await cryptoManager.encryptWithSecret(
          Buffer.from(serializedPrivSignJWK, "utf8").buffer,
          ak
        );

        // Decrypt & Import
        const decryptedPrivSignKeyBuf = await cryptoManager.decryptWithSecret(
          encPrivSignKey,
          ak
        );
        const serializedRegenedPrivSignKey = Buffer.from(
          decryptedPrivSignKeyBuf
        ).toString("utf8");
        const parsedRegenedPrivSignKey = JSON.parse(
          serializedRegenedPrivSignKey
        );
        const regendPrivSignKey = await cryptoManager.importPrivateSignJsonWebKey(
          parsedRegenedPrivSignKey
        );
        const parsedRegenedPubVerifyKey = JSON.parse(serializedPubVerifyKey);
        const regendPubVerifyKey = await cryptoManager.importPublicVerifyJsonWebKey(
          parsedRegenedPubVerifyKey
        );

        // Verify Original Sign to Regenerated Verify
        const dataTestO2R = cryptoManager.getRandomValues(32).buffer;
        const origSig = await cryptoManager.signWithPrivateKey(
          signKeyPair.privateKey,
          dataTestO2R
        );
        const origSigOK = await cryptoManager.verifyWithPublicKey(
          regendPubVerifyKey,
          origSig,
          dataTestO2R
        );
        ok = ok && origSigOK;

        // Verify Regenerated Sign to Original Verify
        const dataTestR2O = cryptoManager.getRandomValues(32).buffer;
        const regenSig = await cryptoManager.signWithPrivateKey(
          regendPrivSignKey,
          dataTestR2O
        );
        const regenSigOK = await cryptoManager.verifyWithPublicKey(
          signKeyPair.publicKey,
          regenSig,
          dataTestR2O
        );
        ok = ok && regenSigOK;

        if (this.isMountableMounted) {
          this.setState({
            testExportImportSignKeyPair: ok
          });
        }
        return ok;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error("ERR exportSymKey", err);
        if (this.isMountableMounted) {
          this.setState({ testExportImportSignKeyPair: false });
        }
      }
    }
    return false;
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
    props: props => ({
      ...props,
      subscribeToNewHealthMetrics: () =>
        props.data!.subscribeToMore({
          document: HEALTH_METRIC_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => ({
            ...prev,
            ...subscriptionData.data
          })
        })
    })
  }
);

export default withHealthSubscriptionData(Health);
