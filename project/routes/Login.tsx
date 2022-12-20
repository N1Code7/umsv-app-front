import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { AuthTokenContext } from "../../contexts/AuthTokenContext";
import Homepage from "./Homepage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const { authToken, setAuthToken } = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const handleEmail = (e: any) => {
    if (e.target.value) {
      setEmail(e.target.value);
    }
  };

  const handlePassword = (e: any) => {
    console.log(e.target);

    if (!e.target.value) {
      return;
    } else {
      setPassword(e.target.value);
    }
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
    passwordValidated && emailValidated ? setSubmitEnabled(true) : setSubmitEnabled(false);

    let bodyRequest: any = {
      email: email,
      password: password,
    };

    await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      mode: "cors",
      cache: "default",
      body: JSON.stringify(bodyRequest),
    })
      .then((res) => res.json())
      .then(({ token }: any) => {
        setAuthToken?.(token);
        console.log(authToken);
      });
    navigate("/dashboard");
  };

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
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
