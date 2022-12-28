import { useContext, useEffect, useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchLogin, fetchRefreshToken, getRefreshTokenFromCookie } from "../../config/functions";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticationContext);
  const { authToken, setAuthToken } = useContext(AuthenticationContext);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const handleEmail = (e: any) => {
    if (e.target.value) {
      setEmail(e.target.value);
    }
  };

  const handlePassword = (e: any) => {
    if (!e.target.value) {
      return;
    } else {
      setPassword(e.target.value);
    }
  };

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    email.includes("@")
      ? setEmailError("")
      : setEmailError("L'adresse email renseignée n'est pas conforme 🚨");
    password.length >= 6
      ? setPasswordError("")
      : setPasswordError("Le mot de passe doit contenir au minimum 6 caractères 🚨");

    if (email.includes("@") && password.length >= 6) {
      await fetchLogin(email, password)
        .then((res) => res.json())
        .then(({ token, refreshToken }: any) => {
          setIsAuthenticated?.(true);
          setAuthToken?.(token);
          document.cookie = `refreshToken=${refreshToken};max-age=2592000;SameSite=strict;secure`;
          navigate("/utilisateur/accueil");
        });
    } else {
      throw new Error("An error occurs around email and/or password checking!");
    }
  };

  useEffect(() => {
    if (getRefreshTokenFromCookie() && getRefreshTokenFromCookie() !== "") {
      try {
        fetchRefreshToken(getRefreshTokenFromCookie())
          .then((res) => res.json())
          .then((res) => {
            if (res.code === 401) {
              console.log("Refresh token does't correspond!");
              return;
            } else {
              setIsAuthenticated?.(true);
              setAuthToken?.(res.token);
              document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure`;
              navigate("/utilisateur/accueil");
              // navigate(-1);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    email.includes("@") && password.length >= 6 ? setSubmitEnabled(true) : setSubmitEnabled(false);
  }, [email, password]);

  return (
    <>
      <Header />
      <main className="login">
        <h1>Welcome to USMV App</h1>
        <form className="form">
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <Input type="email" id="email" value={email} action={handleEmail} />
            {emailError && <div className="errorMessage-input">{emailError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input">
              <Input
                type={passwordVisible ? "text" : "password"}
                id="password"
                action={handlePassword}
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
          <Input
            type="submit"
            value="Se connecter"
            css={submitEnabled ? "btn btn-primary" : "btn btn-warning"}
            action={handleSubmit}
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
