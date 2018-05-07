import { SignOutController } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(SignOutController, true, '/sign-in', '/sign-out');
