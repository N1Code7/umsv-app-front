import { MouseEvent } from "react";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ActionsCTA = ({ tournamentRegistration, handleModify }: IProps) => {
  return (
    <>
      <div className="cta-container">
        <button className="btn modify" onClick={handleModify}>
          ✏️
        </button>
      </div>
    </>
  );
};

export default ActionsCTA;
