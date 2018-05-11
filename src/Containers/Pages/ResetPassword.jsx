// @flow
import { ResetPasswordController } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(ResetPasswordController, false, '/profile', '/forgot-password');
