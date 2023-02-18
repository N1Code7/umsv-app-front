import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Header from "../components/Header";
import { fetchCreateAccount } from "../../utils/fetchFunctions";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { IUser } from "../../interfaces/interfaces";

const SignUp = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthenticationContext);

  const lastName = useRef<HTMLInputElement>(null);
  const firstName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  const [lastNameError, setLastNameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [percent, setPercent] = useState("");
  const [displayConfirmMessage, setDisplayConfirmMessage] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = (e: any) => {
    e.preventDefault();
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    !lastName.current?.value.match(/^[A-ZÀ-ÿa-z][A-ZÀ-ÿa-z -]+/)
      ? setLastNameError(
          "Votre nom de famille doit commencer par une lettre et ne doit pas comporter de chiffre"
        )
      : setLastNameError("");
    !firstName.current?.value.match(/^[A-ZÀ-ÿa-z][A-ZÀ-ÿa-z -]+/)
      ? setFirstNameError(
          "Votre prénom doit commencer par une lettre et ne doit pas comporter de chiffre"
        )
      : setFirstNameError("");
    !email.current?.value.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/)
      ? setEmailError("L'email renseigné n'est pas conforme")
      : setEmailError("");
    !password.match(/^[\w\-\*\/!?#&\$\^€%]{6,}/)
      ? setPasswordError(
          "Votre mot de passe est trop court et/ou comporte des caractères interdits"
        )
      : setPasswordError("");
    password !== confirmPassword.current?.value
      ? setConfirmPasswordError("Les deux mots de passe ne correspondent pas !")
      : setConfirmPasswordError("");

    if (
      lastName.current!.value.match(/^[A-ZÀ-ÿa-z][A-ZÀ-ÿa-z -]+/) &&
      firstName.current!.value.match(/^[A-ZÀ-ÿa-z][A-ZÀ-ÿa-z -]+/) &&
      email.current!.value.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/) &&
      password.match(/^[\w\-\*\/!?#&\$\^€%]{6,}/) &&
      password === confirmPassword.current!.value
    ) {
      // setIsLoading(true);
      fetchCreateAccount(
        email.current!.value,
        password,
        confirmPassword.current!.value,
        lastName.current!.value,
        firstName.current!.value
      )
        .then((res) => {
          lastName.current!.value = "";
          firstName.current!.value = "";
          email.current!.value = "";
          setPassword("");
          confirmPassword.current!.value = "";

          if (res.ok) {
            setHasErrorOccurred(false);
            setDisplayConfirmMessage(true);
            return res.json();
          } else {
            setHasErrorOccurred(false);
            setDisplayConfirmMessage(true);
            return;
          }
        })
        .then((res) => {
          if (res) {
            setUser?.((prev: IUser) => ({ ...prev, email: res.email }));
            setTimeout(() => {
              navigate("/");
            }, 20000);
          }
        });
    }
  };

  useEffect(() => {
    if (password.length === 0) {
      setPercent("");
    } else if (password.length >= 10 && password.match(/[A-Z]+[0-9]+/)) {
      setPercent("100");
    } else if (password.length >= 6) {
      setPercent("66");
    } else {
      setPercent("33");
    }
  }, [password]);

  return (
    <>
      <Header />
      <main className="sign-up">
        <div
          className="notification-message"
          style={displayConfirmMessage ? { display: "block" } : { display: "none" }}
        >
          {displayConfirmMessage &&
            (hasErrorOccurred ? (
              <div className="error">
                <p>
                  Une erreur est survenue lors de la demande de création de votre compte et nous en
                  sommes désolés 🙏.
                </p>
                <p>Merci de réitérer votre demande opération ultérieurement...</p>
              </div>
            ) : (
              <div className="success">
                <p>Votre demande de création de compte a bien été effecutée.</p>
                <p>
                  Vous serez averti prochainement par email lorsqu&apos;un administrateur aura
                  validé votre identité.
                </p>
                <p>Pensez à vérifier vos spams 😉.</p>
                <p>
                  Retourner à la page de <NavLink to="/">connexion</NavLink>
                </p>
              </div>
            ))}
        </div>
        <h1>Création de compte</h1>
        <form className="form">
          <div className="form-row">
            <label htmlFor="lastName">NOM</label>
            <input type="text" id="lastName" ref={lastName} required />
            {lastNameError !== "" && <div className="errorMessage-input">{lastNameError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="firstName">Prénom</label>
            <input type="text" id="firstName" ref={firstName} required />
            {firstNameError !== "" && <div className="errorMessage-input">{firstNameError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={email} required />
            {emailError !== "" && <div className="errorMessage-input">{emailError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div
              className={
                percent !== ""
                  ? `password-evaluation password-evaluation-${percent}`
                  : "password-evaluation"
              }
            ></div>
            {passwordError !== "" && <div className="errorMessage-input">{passwordError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="confirmPassword">Confirmation mot de passe</label>
            <div className="password-input">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                ref={confirmPassword}
              />
              <button
                className={confirmPasswordVisible ? "hide" : "display"}
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            {confirmPasswordError !== "" && (
              <div className="errorMessage-input">{confirmPasswordError}</div>
            )}
          </div>
          <Input type="submit" value="S'enregistrer" css="btn btn-primary" action={handleSubmit} />
          <NavLink to="/">J&apos;ai déjà un compte, je souhaite me connecter 👉</NavLink>
        </form>
      </main>
    </>
  );
};

export default SignUp;
