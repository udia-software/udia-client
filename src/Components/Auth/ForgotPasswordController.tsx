import gql from "graphql-tag";
import React, { ChangeEventHandler, Component, FormEventHandler } from "react";
import { graphql, MutateProps } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { setFormEmail } from "../../Modules/Reducers/Auth/Actions";
import { isMountable } from "../../Types";
import parseGraphQLError from "../Helpers/ParseGraphQLError";
import ForgotPasswordView from "./ForgotPasswordView";

interface IProps
  extends MutateProps<
      ISendForgotPasswordResponseData,
      ISendForgotPasswordVariables
    > {
  dispatch: Dispatch;
  email: string;
}

interface IState {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  emailErrors: string[];
  requestSent: boolean;
}

class ForgotPasswordController extends Component<IProps, IState>
  implements isMountable {
  public isMountableMounted = false;

  constructor(props: IProps) {
    super(props);
    document.title = "Forgot Password - UDIA";
    this.state = {
      loading: false,
      errors: [],
      emailErrors: [],
      requestSent: false
    };
  }

  public componentDidMount() {
    this.isMountableMounted = true;
  }

  public componentWillUnmount() {
    this.isMountableMounted = false;
  }

  public handleChangeEmail: ChangeEventHandler<HTMLInputElement> = e => {
    this.props.dispatch(setFormEmail(e.currentTarget.value));
    this.setState({ emailErrors: [] });
  };

  public handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    try {
      e.preventDefault();
      const { email, mutate } = this.props;
      this.setState({
        loading: true,
        errors: [],
        emailErrors: [],
        loadingText: "Communicating with server..."
      });
      await mutate({ variables: { email } });
      this.setState({ requestSent: true });
    } catch (err) {
      const { errors, emailErrors } = parseGraphQLError(
        err,
        "Failed to request password reset!"
      );
      this.setState({
        errors,
        emailErrors,
        requestSent: false
      });
    } finally {
      if (this.isMountableMounted) {
        this.setState({
          loading: false,
          loadingText: undefined
        });
      }
    }
  };

  public render() {
    const { email } = this.props;
    const {
      loading,
      loadingText,
      errors,
      emailErrors,
      requestSent
    } = this.state;
    return (
      <ForgotPasswordView
        loading={loading}
        loadingText={loadingText}
        email={email}
        errors={errors}
        requestSent={requestSent}
        emailErrors={emailErrors}
        handleChangeEmail={this.handleChangeEmail}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

const SEND_FORGOT_PASSWORD_EMAIL = gql`
  mutation SendForgotPasswordEmail($email: String!) {
    sendForgotPasswordEmail(email: $email)
  }
`;

interface ISendForgotPasswordResponseData {
  sendForgotPasswordEmail: boolean;
}

interface ISendForgotPasswordVariables {
  email: string;
}

const mapStateToProps = (state: IRootState) => ({
  email: state.auth.email
});

export default connect(mapStateToProps)(
  graphql<
    IProps,
    ISendForgotPasswordResponseData,
    ISendForgotPasswordVariables
  >(SEND_FORGOT_PASSWORD_EMAIL)(ForgotPasswordController)
);
