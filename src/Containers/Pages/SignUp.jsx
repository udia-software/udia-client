import { SignUp } from "../../Components/Auth";
import { WithAuthentication } from "../../Components/Wrapper";

const SignUpPage = WithAuthentication(SignUp, false, "/", "/sign-up");
export { SignUpPage };
export default SignUpPage;
