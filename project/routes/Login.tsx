import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import {
  fetchLogin,
  fetchRefreshToken,
  fetchUser,
  getRefreshTokenFromCookie,
} from "../../config/fetchFunctions";
import Header from "../components/Header";
import { IUser } from "../../config/interfaces";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { user, setUser, setAuth } = useContext(AuthenticationContext);
  const [email, setEmail] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    !email.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/)
      ? setEmailError("L'adresse email renseignée n'est pas conforme 🚨")
      : setEmailError("");
    password.length < 6
      ? setPasswordError("Le mot de passe doit contenir au minimum 6 caractères 🚨")
      : setPasswordError("");

    if (email.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/) && password.length >= 6) {
      fetchLogin(email, password)
        .then((res) => {
          setPassword("");
          setHasErrorOccurred(false);
          setAuth?.({ accessToken: res.token, isAuthenticated: true });
          document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
          navigate(from, { replace: true });
        })
        .catch(() => {
          setHasErrorOccurred(true);
          setTimeout(() => {
            setHasErrorOccurred(false);
          }, 5000);
        });
    }
  };

  useEffect(() => {
    if (getRefreshTokenFromCookie() && getRefreshTokenFromCookie() !== "") {
      fetchRefreshToken()
        .then((res) => {
          setAuth?.({ accessToken: res.token, isAuthenticated: true });
          document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
          navigate(from, { replace: true });
        })
        .catch((err) => console.error(err));
    }
  }, [setAuth, navigate, from]);

  useEffect(() => {
    email.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/) && password.length >= 6
      ? setSubmitEnabled(true)
      : setSubmitEnabled(false);
  }, [email, password]);

  return (
    <>
      <Header />
      <main className="login">
        {hasErrorOccurred && (
          <div className="error-message">
            <p>Oups ! Quelque chose ne va pas avec votre email et/ou votre mot de passe.</p>
          </div>
        )}
        <h1>Welcome to USMV App</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={user?.email ? user?.email : email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <div className="errorMessage-input">{emailError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className={passwordVisible ? "hide" : "display"}
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            <NavLink to="/reinitialiser_mot_de_passe" className="forgotten-password">
              Mot de passe oublié ?
            </NavLink>
            {passwordError !== "" && <div className="errorMessage-input">{passwordError}</div>}
          </div>
          <input
            type="submit"
            value="Se connecter"
            className={submitEnabled ? "btn btn-primary" : "btn btn-warning"}
          />
          <div className="remember-me">
            <Input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Se souvenir de moi</label>
          </div>
          <NavLink to="/creer_un_compte">Pas encore de compte ? Je veux en créer un 👉</NavLink>
        </form>
      </main>
    </>
  );
};

export default Login;
