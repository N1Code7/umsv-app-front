import { useState } from "react";
import RegistrationForm from "../../../features/tournamentsRegistrations/RegistrationForm";

const NewTournamentRegistration = () => {
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });

  return (
    <main className="new-registration user-space">
      {requestMessage.success !== "" && (
        <div className="notification-message">
          <p className="success">{requestMessage.success}</p>
        </div>
      )}
      {requestMessage.error !== "" && (
        <div className="notification-message">
          <p className="error">{requestMessage.error}</p>
        </div>
      )}

      <h2>Demande d&apos;inscription à un tournoi</h2>

      <RegistrationForm setRequestMessage={setRequestMessage} />
    </main>
  );
};

export default NewTournamentRegistration;
