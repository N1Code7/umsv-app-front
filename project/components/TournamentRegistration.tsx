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
        <button className="btn modify">✏️</button>
        <button className="btn cancel">🗑️</button>
        <a
          // HAVE TO CHANGE URL !!!!!!
          href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
          className="btn see-file"
          target="_blank"
          rel="noopener noreferrer"
        >
          📄
        </a>
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
        {tournamentRegistration.participationSingle === true && <span>Simple</span>}
        {tournamentRegistration.participationDouble === true && (
          <span>Double avec {tournamentRegistration.doublePartnerName}</span>
        )}
        {tournamentRegistration.participationSingle === true && (
          <span>Mixte avec {tournamentRegistration.mixedPartnerName}</span>
        )}
      </td>

      <td>
        {tournamentRegistration.requestState === "pending" ? (
          <span className="status-tag status-tag-warning">En attente</span>
        ) : tournamentRegistration.requestState === "validated" ? (
          <span className="status-tag status-tag-success">Validée</span>
        ) : (
          <span className="status-tag status-tag-canceled">Annulée</span>
        )}
      </td>

      <td>
        <div className="cta-container">
          <button className="btn modify">✏️</button>
          <button className="btn cancel">🗑️</button>
          <a
            // HAVE TO CHANGE URL !!!!!!
            href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
            className="btn see-file"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄
          </a>
        </div>
      </td>
    </tr>
  );
};

export default TournamentRegistration;
