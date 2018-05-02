import { Profile } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(Profile, true, '/sign-in', '/profile');
