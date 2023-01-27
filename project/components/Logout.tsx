import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useContext } from "react";
import { fetchInvalidateRefreshToken } from "../../config/fetchFunctions";
import { mutate } from "swr";

const Logout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser, setAuth } = useContext(AuthenticationContext);

  const clearCache = () => mutate(() => true, undefined, { revalidate: false });

  const logout = async () => {
    await fetchInvalidateRefreshToken().then(() => {
      setAuth?.({});
      setUser?.({});
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
    });
    clearCache();
    navigate("/se_connecter", { state: { from: location }, replace: true });
  };

  return (
    <button className="btn-logout" onClick={logout}>
      <i className="fa-solid fa-right-from-bracket img-logout"></i>
    </button>
  );
};

export default Logout;
