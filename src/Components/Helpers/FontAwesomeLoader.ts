import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCheck,
  faEllipsisV,
  faEnvelope,
  faEye,
  faEyeSlash,
  faFileAlt,
  faFolder,
  faFolderOpen,
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
  library.add(faCheck); // check mark
  library.add(faFolder); // closed folder
  library.add(faFolderOpen); // open folder
  library.add(faFileAlt); // file with lines (notes)
  library.add(faEllipsisV); // vertical dots (file browser items)
};

export default loadFontAwesomeIcons;
