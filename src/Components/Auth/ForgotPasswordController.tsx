import { GraphQLError } from "graphql";
import gql from "graphql-tag";
import React, { ChangeEventHandler, Component, FormEventHandler } from "react";
import { graphql, MutateProps } from "react-apollo";
import { connect, Dispatch } from "react-redux";
import { setFormEmail } from "../../Modules/Reducers/Auth/Actions";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import { isMountable } from "../../Types";
import ForgotPasswordView from "./ForgotPasswordView";

export interface IProps
  extends MutateProps<
      ISendForgotPasswordResponseData,
      ISendForgotPasswordVariables
    > {
  dispatch: Dispatch;
  email: string;
}

export interface IState {
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
      const { graphQLErrors, networkError, message } = err;
      const errors: string[] = [];
      let emailErrors: string[] = [];
      if (graphQLErrors && graphQLErrors.length) {
        graphQLErrors.forEach(
          (graphQLError: GraphQLError & { state: { email?: string[] } }) => {
            const errorState = graphQLError.state || {};
            emailErrors = emailErrors.concat(errorState.email || []);
          }
        );
      }
      const catchAll = emailErrors.length === 0;

      if (networkError || catchAll) {
        // tslint:disable-next-line:no-console
        console.warn(err);
        errors.push(message || "Failed to request password reset!");
      }
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

function mapStateToProps(state: IRootState) {
  return {
    email: state.auth.email
  };
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

export default connect(mapStateToProps)(
  graphql<
    IProps,
    ISendForgotPasswordResponseData,
    ISendForgotPasswordVariables
  >(SEND_FORGOT_PASSWORD_EMAIL)(ForgotPasswordController)
);
