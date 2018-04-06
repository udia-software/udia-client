import { Profile } from "Components/Auth";
import { WithAuthentication } from "Components/Wrapper";

const ProfilePage = WithAuthentication(
  Profile,
  true,
  "/sign-in",
  "/profile"
);

export { ProfilePage };
export default ProfilePage;
