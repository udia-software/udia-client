import { SignUp } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(SignUp, false, '/', '/sign-up');
