import { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import { ITournamentRegistration } from "../../../interfaces/interfaces";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { formatDate } from "../../../utils/dateFunctions";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setFocusedRegistration: Dispatch<SetStateAction<ITournamentRegistration>>;
}

const ResultsDisplayedOnDesktop = ({
  tournamentRegistration,
  setIsModalActive,
  setFocusedRegistration,
}: IProps) => {
  const { user } = useContext(AuthenticationContext);
  const handleClickButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalActive(true);
    setFocusedRegistration(tournamentRegistration);
  };

  return (
    <tr>
      {/* Tournament date */}
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
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
      </td>
      {/* Tournament name */}
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration.tournament && tournamentRegistration.tournament.name}
      </td>
      {/* Tournament city */}
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration.tournament
          ? tournamentRegistration.tournament.city
          : tournamentRegistration.tournamentCity}
      </td>
      {/* Participations and partners */}
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration?.participationSingle &&
          (tournamentRegistration?.result?.singleStageReached || "❓")}
      </td>
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration?.participationDouble &&
          (tournamentRegistration?.result?.doubleStageReached || "❓")}
      </td>
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration?.participationMixed &&
          (tournamentRegistration?.result?.mixedStageReached || "❓")}
      </td>
      <td>{tournamentRegistration?.result?.areResultsValidated ? "✅" : "🚫"}</td>
      <td>
        <div className="cta-container registrations-actions">
          <button className="btn modify" onClick={handleClickButton}>
            ✏️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ResultsDisplayedOnDesktop;
