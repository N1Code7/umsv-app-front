import { MouseEvent } from "react";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
  handleValidate: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
  handleCancel: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
  handleDelete: (e: MouseEvent<HTMLButtonElement>) => void;
}

const AdminRegistrationCTA = ({
  tournamentRegistration,
  handleModify,
  handleValidate,
  handleCancel,
  handleDelete,
}: IProps) => {
  //
  return (
    <div className="cta-container">
      <button onClick={handleModify}>✏️</button>
      <button
        style={{ display: tournamentRegistration.requestState === "validated" ? "none" : "flex" }}
        onClick={handleValidate}
      >
        ✅
      </button>
      <button
        style={{ display: tournamentRegistration.requestState === "cancelled" ? "none" : "flex" }}
        onClick={handleCancel}
      >
        ↩️
      </button>
      <button onClick={handleDelete}>🗑️</button>
    </div>
  );
};

export default AdminRegistrationCTA;
