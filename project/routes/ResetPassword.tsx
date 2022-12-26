import { use, useRef, useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { fetchInitResetPassword } from "../../config/functions";

const ResetPassword = () => {
  const email = useRef<HTMLInputElement>(null);

  const [displayConfirmMessage, setDisplayConfirmMessage] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

  const handleSubmit = async () => {
    await fetchInitResetPassword(email).then((res) => {
      setDisplayConfirmMessage(true);
      if (res.ok) {
        return setHasErrorOccurred(false);
      } else {
        return setHasErrorOccurred(true);
      }
    });
  };

  return (
    <>
      <Header />
      <div className="reset-password-confirm-message">
        {displayConfirmMessage &&
          (hasErrorOccurred ? (
            <div className="error">
              <p>Une erreur est survenue lors de la réinitialisation de votre mot de passe.</p>
              <p>Merci de réitérer l&apos;opération ultérieurement</p>
            </div>
          ) : (
            <div className="success">
              <p>Votre demande de réinitialisation a bien été traitée.</p>
              <p>Merci de vérifier vos mails et de suivre les directives</p>
            </div>
          ))}
      </div>

      <main className="reset-password">
        <h1>Réinitialiser mon mot de passe</h1>

        <p>Veuillez renseigner votre email afin de réinitialiser votre mot de passe.</p>

        <form className="form">
          <div className="form-raw">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              ref={email}
              onChange={(e) => {
                email.current!.value = e.target.value;
              }}
            />
          </div>
          <input
            type="submit"
            value="Démarer la réinitialisation"
            className="btn btn-primary"
            onClick={handleSubmit}
          />
        </form>
      </main>
    </>
  );
};

export default ResetPassword;
