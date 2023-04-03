import { MouseEvent } from "react";
import RegistrationCTA from "./RegistrationCTA";
import { ITournamentRegistration } from "../../../interfaces/interfaces";
import { formatDate } from "../../../utils/dateFunctions";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
  handleCancel: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const RegistrationMobileDisplay = ({
  tournamentRegistration,
  handleCancel,
  handleModify,
}: IProps) => {
  return (
    <div className="registration card">
      <div
        className="name"
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration.tournament
          ? tournamentRegistration.tournament.name
          : tournamentRegistration.tournamentName}
      </div>
      <div
        className="city"
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration.tournament
          ? tournamentRegistration.tournament.city
          : tournamentRegistration.tournamentCity}
      </div>
      <div
        className="dates"
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration.tournament
          ? formatDate(
              String(tournamentRegistration.tournament.startDate),
              String(tournamentRegistration.tournament.endDate),
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
      <RegistrationCTA
        tournamentRegistration={tournamentRegistration}
        handleCancel={handleCancel}
        handleModify={handleModify}
      />
    </div>
  );
};

export default RegistrationMobileDisplay;
