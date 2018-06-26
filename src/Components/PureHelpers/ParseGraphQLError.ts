import { GraphQLError } from "graphql";

interface IGraphQLErrorExtended extends GraphQLError {
  state?: {
    email?: string[];
    pw?: string[];
    username?: string[];
    emailToken?: string[];
  };
}

/**
 * Helper function for parsing GraphQL error messages
 * @param err Caught error object
 * @param fallbackErrorMsg Fallback message in case the error is unknown.
 */
const parseGraphQLError = (
  err: any,
  fallbackErrorMsg: string = "Unknown application error!"
) => {
  const { graphQLErrors, networkError, message } = err;
  const errors: string[] = [];

  let emailErrors: string[] = [];
  let passwordErrors: string[] = [];
  let usernameErrors: string[] = [];
  let emailTokenErrors: string[] = [];

  try {
    if (graphQLErrors && graphQLErrors.length) {
      graphQLErrors.forEach((graphQLError: IGraphQLErrorExtended) => {
        const errorState = graphQLError.state || {};
        emailErrors = emailErrors.concat(errorState.email || []);
        passwordErrors = passwordErrors.concat(errorState.pw || []);
        usernameErrors = usernameErrors.concat(errorState.username || []);
        emailTokenErrors = emailTokenErrors.concat(errorState.emailToken || []);
      });
    }
    const catchAll =
      emailErrors.length === 0 &&
      passwordErrors.length === 0 &&
      usernameErrors.length === 0 &&
      emailTokenErrors.length === 0;
    if (networkError) {
      errors.push(message);
    } else if (catchAll) {
      // tslint:disable-next-line:no-console
      console.warn(err);
      errors.push(message || fallbackErrorMsg);
    }
  } catch (err) {
    errors.push(err.message);
  }

  return {
    errors,
    emailErrors,
    passwordErrors,
    usernameErrors,
    emailTokenErrors
  };
};

export default parseGraphQLError;
