// @flow
import { ProfileController } from '../../Components/Auth';
import { WithAuthentication } from '../../Components/Wrapper';

export default WithAuthentication(ProfileController, true, '/sign-in', '/profile');
