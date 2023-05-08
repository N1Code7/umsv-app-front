import { MouseEvent } from "react";
import { ITournamentRegistration } from "../../../interfaces/interfaces";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
  handleCancel: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const RegistrationCTA = ({ tournamentRegistration, handleCancel, handleModify }: IProps) => {
  return (
    <div className="cta-container registrations-actions">
      <div className="tets">HELLOOOOOO</div>
      <button
        className="btn btn-modify"
        onClick={handleModify}
        disabled={
          new Date(
            tournamentRegistration.tournament?.startDate ||
              tournamentRegistration.tournamentStartDate
          ) <= new Date()
        }
      >
        ✏️
      </button>
      <button
        className="btn btn-cancel"
        onClick={handleCancel}
        disabled={
          new Date(
            tournamentRegistration.tournament?.startDate ||
              tournamentRegistration.tournamentStartDate
          ) <= new Date() || tournamentRegistration.requestState === "cancelled"
        }
      >
        🗑️
      </button>
      <a
        // HAVE TO CHANGE URL !!!!!!
        href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
        className="btn btn-see-file"
        target="_blank"
        rel="noopener noreferrer"
      >
        📄
      </a>
    </div>
  );
};

export default RegistrationCTA;
