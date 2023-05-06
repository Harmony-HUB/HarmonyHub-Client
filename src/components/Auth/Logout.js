import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Logout({ onLogout }) {
  const handleGoogleLogin = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    onLogout();
  };
  return (
    <button type="button" onClick={handleGoogleLogin}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );
}

export default Logout;

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
