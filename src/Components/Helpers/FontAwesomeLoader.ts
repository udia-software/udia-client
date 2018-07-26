import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCheck,
  faCheckCircle,
  faEllipsisV,
  faEnvelope,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFile,
  faFileAlt,
  faFolder,
  faFolderOpen,
  faInfoCircle,
  faKey,
  faPencilAlt,
  faPlus,
  faSave,
  faSearch,
  faSpinner,
  faTrash,
  faUser,
  faUserSlash,
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
  library.add(faFile); // file (note options)
  library.add(faFileAlt); // file with lines (notes)
  library.add(faEllipsisV); // vertical dots (file browser items)
  library.add(faPlus); // plus sign (for stacking on icons)
  library.add(faPencilAlt); // alternative pencil (for editor icon)
  library.add(faTrash); // trash can for discarding drafts
  library.add(faSave); // save icon for committing drafts to server
  library.add(faSearch); // search icon
  library.add(faInfoCircle); // info circle (status)
  library.add(faExclamationTriangle); // exclaimation triangle (status)
  library.add(faCheckCircle); // checkmark in circle (status)
};

export default loadFontAwesomeIcons;
