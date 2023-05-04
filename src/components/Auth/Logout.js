import PropTypes from "prop-types";

function Logout({ onLogout }) {
  const handleGoogleLogin = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    onLogout();
  };
  return (
    <button type="button" onClick={handleGoogleLogin}>
      Logout
    </button>
  );
}

export default Logout;

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
