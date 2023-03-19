import { MouseEvent } from "react";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";

interface IProps {
  registration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
  handleValidate: (e: MouseEvent<HTMLButtonElement>) => void;
  handleCancel: (e: MouseEvent<HTMLButtonElement>) => void;
  handleRemove: (e: MouseEvent<HTMLButtonElement>) => void;
}

const AdminRegistrationCTA = ({
  registration,
  handleModify,
  handleValidate,
  handleCancel,
  handleRemove,
}: IProps) => {
  return (
    <div className="cta-container">
      <button onClick={handleModify}>✏️</button>
      <button
        style={{ display: registration.requestState === "validated" ? "none" : "flex" }}
        onClick={handleValidate}
      >
        ✅
      </button>
      <button
        style={{ display: registration.requestState === "cancelled" ? "none" : "flex" }}
        onClick={handleCancel}
      >
        ↩️
      </button>
      <button onClick={handleRemove}>🗑️</button>
    </div>
  );
};

export default AdminRegistrationCTA;
