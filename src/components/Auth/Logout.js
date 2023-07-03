import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button/Button";

function Logout({ onLogout }) {
  const handleGoogleLogin = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    onLogout();
  };
  return (
    <Button type="button" onClick={handleGoogleLogin}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </Button>
  );
}

export default Logout;

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
