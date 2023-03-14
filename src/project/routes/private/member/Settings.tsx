import { useContext } from "react";
import Header from "../../../layouts/Header";
import MemberHeader from "../../../layouts/MemberHeader";
import Navigation from "../../../layouts/Navigation";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";

const Settings = () => {
  const { user } = useContext(AuthenticationContext);

  return (
    <>
      <main className="user-space" style={{ maxWidth: 1600 }}>
        <h2>Mes réglages</h2>

        <form className="form">
          <div className="form-bloc">
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" defaultValue={user?.email} />
            </div>
            <button className="btn btn-primary">Modifier mon email</button>
          </div>
          <div className="form-separator"></div>
          <div className="form-bloc">
            <div className="form-row">
              <label htmlFor="password">Nouveau de mot de passe</label>
              <input type="password" name="password" id="password" />
            </div>
            <div className="form-row">
              <label htmlFor="confirmPassword">Confirmer mon nouveau de mot de passe</label>
              <input type="password" name="confirmPassword" id="confirmPassword" />
            </div>
            <button className="btn btn-primary">Modifier mon mot de passe</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default Settings;
