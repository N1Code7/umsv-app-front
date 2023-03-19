import { MouseEvent, useContext } from "react";
import RegistrationCTA from "./RegistrationCTA";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import { formatDate } from "../../../../utils/dateFunctions";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
  handleCancel: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const RegistrationDesktopDisplay = ({
  tournamentRegistration,
  handleCancel,
  handleModify,
}: IProps) => {
  const { user } = useContext(AuthenticationContext);
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
        {tournamentRegistration.participationSingle === true &&
          ((user?.gender === "male" ? <span>SH : oui</span> : <span>SD : oui</span>) || (
            <span>Simple : oui</span>
          ))}

        {tournamentRegistration.participationDouble === true &&
          (user?.gender === "male" ? (
            <span>DH : {tournamentRegistration.doublePartnerName || "❓"}</span>
          ) : (
            <span>DD : {tournamentRegistration.doublePartnerName || "XXX"}</span> || (
              <span>Double : {tournamentRegistration.doublePartnerName || "XXX"}</span>
            )
          ))}

        {tournamentRegistration.participationMixed === true &&
          (user?.gender === "male" || "female" ? (
            <span>DX : {tournamentRegistration.mixedPartnerName || "XXX"}</span>
          ) : (
            <span>Mixte : {tournamentRegistration.mixedPartnerName || "XXX"}</span>
          ))}
      </td>
      {/* Request state */}
      <td>
        {tournamentRegistration.requestState === "pending" ? (
          <span className="status-tag status-tag-warning">En attente</span>
        ) : tournamentRegistration.requestState === "validated" ? (
          <span className="status-tag status-tag-success">Validée</span>
        ) : (
          <span className="status-tag status-tag-cancelled">Annulée</span>
        )}
      </td>
      {/* Action buttons */}
      <td>
        <RegistrationCTA
          tournamentRegistration={tournamentRegistration}
          handleCancel={handleCancel}
          handleModify={handleModify}
        />
      </td>
    </tr>
  );
};

export default RegistrationDesktopDisplay;
