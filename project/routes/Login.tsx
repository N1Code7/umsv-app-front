import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Input from "../components/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [passwordValidated, setPasswordValidated] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    email.includes("@") ? setEmailValidated(true) : setEmailValidated(false);
    password.length >= 6 ? setPasswordValidated(true) : setPasswordValidated(false);
    passwordValidated && emailValidated ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [email, password, emailValidated, passwordValidated]);

  return (
    <main className="login">
      <h1>Welcome to USMV App</h1>
      <form className="form">
        <div className="form-raw">
          <label htmlFor="email">Email</label>
          <Input type="email" id="email" value={email} action={handleEmail} />
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
        </div>
        <Input type="submit" value="Se connecter" css="btn btn-primary" disabled={submitDisabled} />
        <div className="remember-me">
          <Input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Se souvenir de moi</label>
        </div>
        <NavLink to="/nouveau-compte">Pas encore de compte ? Je veux en créer un 👉</NavLink>
      </form>
    </main>
  );
};

export default Login;
