import { formatDate } from "../../config/functions";
import { ITournamentRegistration } from "../../config/interfaces";

interface ITournamentRegistrationProps {
  tournamentRegistration: ITournamentRegistration;
  displayOnMobile: boolean;
}

const TournamentRegistration = ({
  tournamentRegistration,
  displayOnMobile,
}: ITournamentRegistrationProps) => {
  return displayOnMobile ? (
    <div className="tournament card">
      <div className="name">{tournamentRegistration.tournament.name}</div>
      <div className="city">{tournamentRegistration.tournament.city}</div>
      <div className="dates">
        {formatDate(
          tournamentRegistration.tournament.startDate,
          tournamentRegistration.tournament.endDate,
          "XX & XX xxx XXXX"
        )}
      </div>
      <div className="cta-container">
        <a
          // HAVE TO CHANGE URL !!!!!!
          href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
          className="btn see-file"
          target="_blank"
          rel="noopener noreferrer"
        >
          📄
        </a>
        <button className="btn register">➕</button>
      </div>
    </div>
  ) : (
    <tr>
      <td>
        {formatDate(
          tournamentRegistration.tournament.startDate,
          tournamentRegistration.tournament.endDate,
          "XX & XX xxx XXXX"
        )}
      </td>
      <td>{tournamentRegistration.tournament.name}</td>
      <td>{tournamentRegistration.tournament.city}</td>
      <td>
        {new Date(tournamentRegistration.tournament.registrationClosingDate).getTime() -
          new Date().getTime() <
        0
          ? "🙅"
          : formatDate(tournamentRegistration.tournament.registrationClosingDate, "XX/XX/XX")}
      </td>
      <td>
        {new Date(tournamentRegistration.tournament.randomDraw).getTime() - new Date().getTime() < 0
          ? "🙅"
          : formatDate(tournamentRegistration.tournament.randomDraw, "XX/XX/XX")}
      </td>
      <td>
        {
          // tournamentRegistration.tournament.tournamentRegistrations.filter(
          //   (registration: ITournamentRegistration) =>
          //     // registration.tournamentId === tournament.id &&
          //     registration.requestState === "validated"
          // ).length
        }
      </td>
      <td>
        <div className="cta-container">
          <a
            // HAVE TO CHANGE URL !!!!!!
            href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
            className="btn see-file"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄
          </a>
          <button className="btn register">➕</button>
        </div>
      </td>
    </tr>
  );
};

export default TournamentRegistration;
