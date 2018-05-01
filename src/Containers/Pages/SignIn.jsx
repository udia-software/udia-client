import { SignIn } from "../../Components/Auth";
import { WithAuthentication } from "../../Components/Wrapper";

const SignInPage = WithAuthentication(SignIn, false, "/", "/sign-in");

export { SignInPage };
export default SignInPage;
