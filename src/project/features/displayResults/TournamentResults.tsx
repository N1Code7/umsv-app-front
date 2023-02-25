import { Dispatch, MouseEvent, SetStateAction } from "react";
import { ITournamentRegistration } from "../../../interfaces/interfaces";
import DisplayOnMobile from "./components/DisplayOnMobile";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  deviceDisplay: string;
  setFocusedRegistration: Dispatch<SetStateAction<ITournamentRegistration>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

const TournamentResults = ({
  tournamentRegistration,
  deviceDisplay,
  setFocusedRegistration,
  setIsModalActive,
  setRequestMessage,
}: IProps) => {
  const handleModify = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return deviceDisplay === "mobile" ? (
    <DisplayOnMobile tournamentRegistration={tournamentRegistration} handleModify={handleModify} />
  ) : (
    <>
      <p>desk</p>
    </>
  );
};

export default TournamentResults;
