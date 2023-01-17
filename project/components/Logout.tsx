import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useContext } from "react";
import {
  fetchInvalidateRefreshToken,
  getRefreshTokenFromCookie,
} from "../../config/fetchFunctions";

const Logout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser, setAuthToken, setIsAuthenticated } = useContext(AuthenticationContext);

  const logout = async () => {
    await fetchInvalidateRefreshToken(getRefreshTokenFromCookie())
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("An error occurs when the refresh token should be invalidated!");
      })
      .then(() => {
        setUser?.({});
        setIsAuthenticated?.(false);
        setAuthToken?.("");
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
