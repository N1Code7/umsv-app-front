import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useContext } from "react";
import { fetchInvalidateRefreshToken } from "../../config/fetchFunctions";

const Logout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser, setAuth } = useContext(AuthenticationContext);

  const logout = () => {
    fetchInvalidateRefreshToken().then(() => {
      setAuth?.({});
      setUser?.({});
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
      navigate("/", { state: { from: location }, replace: true });
    });
  };

  return (
    <button className="btn-logout" onClick={logout}>
      <i className="fa-solid fa-right-from-bracket img-logout"></i>
    </button>
  );
};

export default Logout;
