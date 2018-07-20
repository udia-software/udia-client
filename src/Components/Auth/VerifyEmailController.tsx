import gql from "graphql-tag";
import React, { ChangeEventHandler, Component, FormEventHandler } from "react";
import { graphql, MutateProps } from "react-apollo";
import { connect } from "react-redux";
import { match } from "react-router";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { setFormEmailVerificationToken } from "../../Modules/Reducers/Auth/Actions";
import parseGraphQLError from "../Helpers/ParseGraphQLError";
import VerifyEmailView from "./VerifyEmailView";

interface IProps
  extends MutateProps<
      IVerifyEmailTokenResponseData,
      IVerifyEmailTokenVariables
    > {
  dispatch: Dispatch;
  match: match<{verificationToken?: string}>
  token: string;
}

interface IState {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  emailTokenErrors: string[];
  emailTokenVerified: boolean;
}

class VerifyEmailController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "Verify Email - UDIA";
    this.state = {
      loading: false,
      errors: [],
      emailTokenErrors: [],
      emailTokenVerified: false
    };
  }

  public async componentDidMount() {
    const urlVerificationToken =
      this.props.match.params.verificationToken || "";
    if (urlVerificationToken) {
      this.props.dispatch(setFormEmailVerificationToken(urlVerificationToken));
      await this.handleGraphQLMutate(urlVerificationToken);
    }
  }

  public render() {
    const { token } = this.props;
    const {
      loading,
      loadingText,
      errors,
      emailTokenErrors,
      emailTokenVerified
    } = this.state;
    return (
      <VerifyEmailView
        loading={loading}
        loadingText={loadingText}
        errors={errors}
        tokenErrors={emailTokenErrors}
        token={token}
        tokenVerified={emailTokenVerified}
        handleChangeVerificationToken={this.handleChangeVerificationToken}
        handleSubmit={this.handleSubmit}
      />
    );
  }

  protected handleChangeVerificationToken: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    this.props.dispatch(setFormEmailVerificationToken(e.currentTarget.value));
    this.setState({ emailTokenErrors: [] });
  };

  protected handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    const { token } = this.props;
    await this.handleGraphQLMutate(token);
  };

  protected handleGraphQLMutate = async (token: string) => {
    try {
      const { mutate } = this.props;
      this.setState({
        loading: true,
        loadingText: "Communicating with server...",
        errors: [],
        emailTokenErrors: []
      });
      await mutate({ variables: { token } });
      this.setState({ loading: false, emailTokenVerified: true });
    } catch (err) {
      const { errors, emailTokenErrors } = parseGraphQLError(
        err,
        "Failed to verify token!"
      );
      this.setState({
        errors,
        emailTokenErrors,
        loading: false,
        emailTokenVerified: false
      });
    }
  };
}

const VERIFY_EMAIL_TOKEN_MUTATION = gql`
  mutation VerifyEmailToken($token: String!) {
    verifyEmailToken(emailToken: $token)
  }
`;

interface IVerifyEmailTokenResponseData {
  verifyEmailToken: boolean;
}

interface IVerifyEmailTokenVariables {
  token: string;
}

const mapStateToProps = (state: IRootState) => ({
  token: state.auth.emailVerificationToken
});

export default connect(mapStateToProps)(
  graphql<IProps, IVerifyEmailTokenResponseData, IVerifyEmailTokenVariables>(
    VERIFY_EMAIL_TOKEN_MUTATION
  )(VerifyEmailController)
);
