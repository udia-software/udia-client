import { SignOut } from "Components/Auth";
import { WithAuthentication } from "Components/Wrapper";

const SignOutPage = WithAuthentication(SignOut, true, "/sign-in", "/sign-out");
export { SignOutPage };
export default SignOutPage;
