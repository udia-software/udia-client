import { SignOut } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(SignOut, true, '/sign-in', '/sign-out');
