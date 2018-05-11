// @flow
import { SignUpController } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(SignUpController, false, '/', '/sign-up');
