import { ForgotPasswordController } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(ForgotPasswordController, false, '/profile', '/forgot-password');
