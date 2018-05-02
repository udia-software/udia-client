import { SignIn } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(SignIn, false, '/', '/sign-in');
