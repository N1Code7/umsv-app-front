import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Homepage from "./Homepage";
import Tournaments from "./Tournaments";
import TournamentRegistration from "./TournamentRegistration";
import Results from "./Results";
import Settings from "./Settings";
import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchRefreshToken, fetchUser, getRefreshTokenFromCookie } from "../../config/functions";

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

interface UserResponse {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
}

const PrivateRoutes = () => {
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticationContext);
  const { user, setUser } = useContext(AuthenticationContext);
  const { authToken, setAuthToken } = useContext(AuthenticationContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (authToken !== "") {
      fetchUser(authToken)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Authentication does not work!");
        })
        .then(({ id, lastName, firstName, email }: UserResponse) => {
          setUser?.({ id, lastName, firstName, email });
        });
    } else if (getRefreshTokenFromCookie() && getRefreshTokenFromCookie() !== "") {
      fetchRefreshToken(getRefreshTokenFromCookie())
        .then((res) => {
          if (res.ok) {
            res.json();
          }
          throw new Error("Can't refresh the token!");
        })
        .then(({ token, refreshToken }: RefreshTokenResponse) => {
          setIsAuthenticated?.(true);
          setAuthToken?.(token);
          document.cookie = `refreshToken=${refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
        });
    } else {
      setIsAuthenticated?.(false);
      setAuthToken?.("");
      setUser?.({});
      navigate("/");
    }
  }, []);

  return (
    <>
      {isAuthenticated && (
        <Routes>
          <Route path="/" element={<Navigate to="/utilisateur/accueil" replace />} />
          {/* <Route path="/" element={<Homepage />} /> */}
          <Route path="/accueil" element={<Homepage />} />
          <Route path="/tournois" element={<Tournaments />} />
          <Route path="/inscription" element={<TournamentRegistration />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="/reglages" element={<Settings />} />
        </Routes>
      )}
    </>
  );
};

export default PrivateRoutes;
