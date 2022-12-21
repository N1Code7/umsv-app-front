import { useContext, useEffect, useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { ApiUrl } from "../../config";

const Login = () => {
  const API = "http://localhost:8000/api/";

  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const { authToken, setAuthToken } = useContext(AuthenticationContext);
  const { user, setUser } = useContext(AuthenticationContext);

  const navigate = useNavigate();

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
    if (email.includes("@")) {
      setEmailValidated(true);
      setEmailError("");
    } else {
      setEmailValidated(false);
      setEmailError("L'adresse email renseignée n'est pas conforme 🚨");
    }
    if (password.length >= 6) {
      setPasswordValidated(true);
      setPasswordError("");
    } else {
      setPasswordValidated(false);
      setPasswordError("Le mot de passe doit contenir au minimum 6 caractères 🚨");
    }

    await fetch(ApiUrl + "login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      mode: "cors",
      cache: "default",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then(({ token }: any) => setAuthToken?.(token));

    // fetch(ApiUrl + "user", {
    //   method: "GET",
    //   headers: {
    //     Authorization: `bearer ${authToken}`,
    //   },
    //   mode: "cors",
    //   cache: "default",
    // })
    //   .then((res) => res.json())
    //   .then((res) => console.log(res));

    // .then(({ id, lastName, firstName, email }) => {
    //   setUser?.({
    //     id,
    //     lastName,
    //     firstName,
    //     email,
    //   });
    // });

    navigate("/tableau_de_bord");
  };

  useEffect(() => {
    if (email.includes("@") && password.length >= 6) {
      setSubmitEnabled(true);
    }
  }, [email, password, emailValidated, passwordValidated]);

  return (
    <main className="login">
      <h1>Welcome to USMV App</h1>
      <form className="form">
        <div className="form-raw">
          <label htmlFor="email">Email</label>
          <Input type="email" id="email" value={email} action={handleEmail} />
          {emailError && <div className="errorMessage-input">{emailError}</div>}
        </div>
        <div className="form-raw">
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
        <NavLink to="/nouveau_compte">Pas encore de compte ? Je veux en créer un 👉</NavLink>
      </form>
    </main>
  );
};

export default Login;
