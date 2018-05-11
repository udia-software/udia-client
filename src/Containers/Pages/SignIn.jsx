// @flow
import { SignInController } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(SignInController, false, '/', '/sign-in');
