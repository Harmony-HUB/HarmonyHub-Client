import PropTypes from "prop-types";
import Button from "./common/Button";

function Logout({ onLogout }) {
  const handleGoogleLogin = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    onLogout();
  };
  return <Button onClick={handleGoogleLogin}>Logout</Button>;
}

export default Logout;

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
