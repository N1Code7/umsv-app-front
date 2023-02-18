import { use, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { fetchInitResetPassword, fetchValidNewPassword } from "../../utils/fetchFunctions";
import { NavLink, Route, Routes, useParams } from "react-router-dom";

const ResetPassword = () => {
  const Request = () => {
    const email = useRef<HTMLInputElement>(null);

    const [displayConfirmMessage, setDisplayConfirmMessage] = useState(false);
    const [hasErrorOccurred, setHasErrorOccurred] = useState(false);
    const [emailError, setEmailError] = useState("");

    const handleRequestSubmit = async (e: any) => {
      e.preventDefault();
      if (email.current?.value.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/)) {
        setEmailError("");
        await fetchInitResetPassword(email.current?.value).then((res) => {
          setDisplayConfirmMessage(true);
          email.current!.value = "";
          if (res.ok) {
            return setHasErrorOccurred(false);
          } else {
            return setHasErrorOccurred(true);
          }
        });
      } else {
        setEmailError("L'adresse email renseignée n'est pas conforme 🚨");
      }
    };
    return (
      <>
        <Header />
        <main className="reset-password">
          <h1>Réinitialiser mon mot de passe</h1>

          <p>Veuillez renseigner votre email afin de réinitialiser votre mot de passe.</p>

          <form className="form" onSubmit={handleRequestSubmit}>
            <div className="form-row">
              {emailError && <div className="errorMessage-input">{emailError}</div>}
              <label htmlFor="email">Email</label>
              <input
                type="email"
                ref={email}
                onChange={(e) => {
                  email.current!.value = e.target.value;
                }}
                required
              />
            </div>
            <input type="submit" value="Démarer la réinitialisation" className="btn btn-primary" />
            <NavLink to="/">Retourner à la page de connexion 👉</NavLink>
          </form>

          <div className="confirm-message">
            {displayConfirmMessage &&
              (hasErrorOccurred ? (
                <div className="error">
                  <p>Une erreur est survenue lors de la réinitialisation de votre mot de passe.</p>
                  <p>Merci de réitérer l&apos;opération ultérieurement.</p>
                </div>
              ) : (
                <div className="success">
                  <p>Votre demande de réinitialisation a bien été traitée.</p>
                  <p>Vous avez dû recevoir un email avec un lien de réinitialisation.</p>
                  <p> (Pensez à vérifier vos spams si vous ne l&apos;avez pas encore reçu).</p>
                </div>
              ))}
          </div>
        </main>
      </>
    );
  };

  const Reset = () => {
    const confirmPassword = useRef<HTMLInputElement>(null);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [percent, setPercent] = useState("");
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [hasErrorOccurred, setHasErrorOccurred] = useState(false);
    const [displayConfirmMessage, setDisplayConfirmMessage] = useState(false);

    const { resetToken } = useParams();

    const toggleNewPasswordVisibility = (e: any) => {
      e.preventDefault();
      setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = (e: any) => {
      e.preventDefault();
      setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleResetSubmit = (e: any) => {
      e.preventDefault();
      !newPassword.match(/^[\w\-\*\/!?#&\$\^€%]{6,}/)
        ? setNewPasswordError("Votre mot de passe comporte des caractères interdits")
        : setNewPasswordError("");
      newPassword !== confirmPassword.current?.value
        ? setConfirmPasswordError("Les deux mots de passe ne correspondent pas !")
        : setConfirmPasswordError("");

      if (
        newPassword.match(/^[\w\-\*\/!?#&\$\^€%]{6,}/) &&
        newPassword === confirmPassword.current?.value
      ) {
        fetchValidNewPassword(resetToken, newPassword, confirmPassword.current!.value).then(
          (res) => {
            setDisplayConfirmMessage(true);
            setNewPassword("");
            confirmPassword.current!.value = "";
            if (res.ok) {
              return setHasErrorOccurred(false);
            } else {
              return setHasErrorOccurred(true);
            }
          }
        );
      }
    };

    useEffect(() => {
      if (newPassword.length === 0) {
        setPercent("");
      } else if (newPassword.length >= 10 && newPassword.match(/([A-Z]+[0-9]+)|([0-9]+[A-Z]+)/)) {
        setPercent("100");
      } else if (newPassword.length >= 6) {
        setPercent("66");
      } else {
        setPercent("33");
      }
    }, [newPassword]);

    return (
      <>
        <Header />
        <main className="reset-password">
          <h1>Mettre à jour mon mot de passe</h1>
          <form className="form" onSubmit={handleResetSubmit} method="POST">
            <div className="form-row">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <div className="password-input">
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  className={newPasswordVisible ? "hide" : "display"}
                  onClick={toggleNewPasswordVisibility}
                >
                  {newPasswordVisible ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
              {newPasswordError !== "" && (
                <div className="errorMessage-input">{newPasswordError}</div>
              )}
              <div
                className={
                  percent !== ""
                    ? `password-evaluation password-evaluation-${percent}`
                    : "password-evaluation"
                }
              ></div>
            </div>
            <div className="form-row">
              <label htmlFor="confirmPassword">Confirmer nouveau mot de passe</label>
              <div className="password-input">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  ref={confirmPassword}
                  required
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
              {confirmPasswordError !== "" ? (
                <div className="errorMessage-input">{confirmPasswordError}</div>
              ) : null}
            </div>

            <input
              type="submit"
              value="Valider mon nouveau mot de passe"
              className="btn btn-primary"
            />
            <NavLink to="/">Retourner à la page de connexion 👉</NavLink>
          </form>

          <div className="confirm-message">
            {displayConfirmMessage &&
              (hasErrorOccurred ? (
                <div className="error">
                  <p>
                    Une erreur est survenue lors de l&apos;enregistrement de votre nouveau mot de
                    passe.
                  </p>
                  <p>Merci de réitérer l&apos;opération ultérieurement.</p>
                </div>
              ) : (
                <div className="success">
                  <p>Votre mot de passe a bien été réinitialisé !</p>
                  <p>
                    Vous pouvez vous connecter dès à présent en retournant sur la page de{" "}
                    <NavLink to="/">connexion</NavLink>
                  </p>
                  <p> (Pensez à vérifier vos spams si vous ne l&apos;avez pas encore reçu).</p>
                </div>
              ))}
          </div>
        </main>
      </>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Request />} />
      <Route path="/:resetToken" element={<Reset />} />
    </Routes>
  );
};

export default ResetPassword;
