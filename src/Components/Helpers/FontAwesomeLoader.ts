import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCheck,
  faEnvelope,
  faEye,
  faEyeSlash,
  faKey,
  faSpinner,
  faUser,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";

// Font awesome icons must be loaded before use in the app
const loadFontAwesomeIcons = () => {
  library.add(faBars); // three lines (hamburg menu)
  library.add(faUser); // user icon
  library.add(faUserSlash); // user icon with a line through it
  library.add(faEye); // eye icon (pw visibility)
  library.add(faEyeSlash); // eye icon with line (pw no visible)
  library.add(faEnvelope); // envelope representing email
  library.add(faKey); // key representing master password
  library.add(faSpinner); // dotted logo circle
  library.add(faCheck);
};

export default loadFontAwesomeIcons;