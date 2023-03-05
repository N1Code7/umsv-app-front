import { Dispatch, MouseEvent, SetStateAction } from "react";
import { ITournamentRegistration } from "../../../interfaces/interfaces";
import { formatDate } from "../../../utils/dateFunctions";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setFocusedRegistration: Dispatch<SetStateAction<ITournamentRegistration>>;
}

const ResultsDisplayedOnMobile = ({
  tournamentRegistration,
  handleModify,
  setIsModalActive,
  setFocusedRegistration,
}: IProps) => {
  //
  const adaptEmojiToRank = (rank: string | undefined) => {
    if (rank === undefined) return undefined;
    if (!rank) return " ❓";
    switch (rank) {
      case "vainqueur":
        return " 🥇";
      case "finaliste":
        return " 🥈";
      case "demi-finaliste":
        return " 🥉";

      default:
        return " 👏";
    }
  };

  const handleClickButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalActive(true);
    setFocusedRegistration(tournamentRegistration);
  };

  return (
    <button className="band" style={{ cursor: "pointer" }} onClick={handleClickButton}>
      <div className="left">
        <div className="name">
          {tournamentRegistration.tournament
            ? tournamentRegistration.tournament.name
            : tournamentRegistration.tournamentName}
        </div>
        <div className="city">
          {tournamentRegistration.tournament
            ? tournamentRegistration.tournament.city
            : tournamentRegistration.tournamentCity}
        </div>
        <div className="dates">
          {tournamentRegistration.tournament
            ? formatDate(
                tournamentRegistration.tournament.startDate,
                tournamentRegistration.tournament.endDate,
                "XX & XX xxx XXXX"
              )
            : tournamentRegistration.tournamentEndDate
            ? formatDate(
                tournamentRegistration.tournamentStartDate,
                tournamentRegistration.tournamentEndDate,
                "XX & XX xxx XXXX"
              )
            : formatDate(tournamentRegistration.tournamentStartDate, undefined, "XX xxx XXXX")}
        </div>
      </div>
      <div className="middle">
        {tournamentRegistration.participationSingle && (
          <div className="single">
            Simple :{" "}
            <span
              style={
                tournamentRegistration.result?.singleStageReached &&
                !tournamentRegistration.result.areResultsValidated
                  ? { opacity: 0.5, fontSize: "1.1rem" }
                  : undefined
              }
            >
              {adaptEmojiToRank(tournamentRegistration.result?.singleStageReached)}
            </span>
          </div>
        )}
        {tournamentRegistration.participationDouble && (
          <div className="double">
            Double :
            <span
              style={
                tournamentRegistration.result.doubleStageReached &&
                !tournamentRegistration.result.areResultsValidated
                  ? { opacity: 0.5, fontSize: "1.1rem" }
                  : undefined
              }
            >
              {adaptEmojiToRank(tournamentRegistration.result.doubleStageReached)}
            </span>
          </div>
        )}
        {tournamentRegistration.participationMixed && (
          <div className="mixed">
            Mixte :
            <span
              style={
                tournamentRegistration.result?.mixedStageReached &&
                !tournamentRegistration.result.areResultsValidated
                  ? { opacity: 0.5, fontSize: "1.1rem" }
                  : undefined
              }
            >
              {adaptEmojiToRank(tournamentRegistration.result?.mixedStageReached) || " ❓"}
            </span>
          </div>
        )}
      </div>
      {/* <div className="right">
        <ActionsCTA tournamentRegistration={tournamentRegistration} handleModify={handleModify} />
        <div className="validation">
          {tournamentRegistration.result.areResultsValidated ? (
            <i className="fa-solid fa-check"></i>
          ) : (
            <i className="fa-solid fa-ellipsis"></i>
            // <i className="fa-regular fa-hourglass"></i>
          )}
        </div>
      </div> */}
      {tournamentRegistration.result?.areResultsValidated && (
        <div className="checked">
          <i className="fa-solid fa-check"></i>
        </div>
      )}
    </button>
  );
};

export default ResultsDisplayedOnMobile;
