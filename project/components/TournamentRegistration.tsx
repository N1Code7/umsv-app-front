import { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import { formatDate } from "../../config/dateFunctions";
import { ITournamentRegistration } from "../../config/interfaces";
import { fetchCancelUserRegistration, fetchRefreshToken } from "../../config/fetchFunctions";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

interface ITournamentRegistrationProps {
  tournamentRegistration: ITournamentRegistration;
  displayOnMobile: boolean;
  setActiveRegistration: Dispatch<SetStateAction<object>>;
}

const TournamentRegistration = ({
  tournamentRegistration,
  displayOnMobile,
  setActiveRegistration,
}: ITournamentRegistrationProps) => {
  const { setAuth } = useContext(AuthenticationContext);

  const handleModify = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleCancel = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchRefreshToken()
      .then((res) => {
        setAuth?.((prev) => ({ ...prev, accessToken: res.token }));
        document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
        return res.token;
      })
      .then((res) => fetchCancelUserRegistration(res, tournamentRegistration.id))
      .then((res) => setActiveRegistration(res))
      .catch((err) => console.error(err));
  };

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
    <tr
      style={
        tournamentRegistration.requestState === "cancelled"
          ? { textDecoration: "line-through", textDecorationThickness: 2 }
          : {}
      }
    >
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
        {tournamentRegistration.participationSingle === true &&
          (tournamentRegistration.user?.gender ? (
            tournamentRegistration.user?.gender === "male" ? (
              <span>SH : oui</span>
            ) : (
              <span>SD : oui</span>
            )
          ) : (
            <span>Simple : oui</span>
          ))}
        {tournamentRegistration.participationDouble === true &&
          (tournamentRegistration.user?.gender ? (
            tournamentRegistration.user?.gender === "male" ? (
              <span>DH : {tournamentRegistration.doublePartnerName}</span>
            ) : (
              <span>DD : {tournamentRegistration.doublePartnerName}</span>
            )
          ) : (
            <span>Double : {tournamentRegistration.doublePartnerName}</span>
          ))}
        {tournamentRegistration.participationSingle === true &&
          (tournamentRegistration.user?.gender ? (
            <span>DX : {tournamentRegistration.mixedPartnerName}</span>
          ) : (
            <span>Mixte : {tournamentRegistration.mixedPartnerName}</span>
          ))}
      </td>

      <td>
        {tournamentRegistration.requestState === "pending" ? (
          <span className="status-tag status-tag-warning">En attente</span>
        ) : tournamentRegistration.requestState === "validated" ? (
          <span className="status-tag status-tag-success">Validée</span>
        ) : (
          <span className="status-tag status-tag-cancelled">Annulée</span>
        )}
      </td>

      <td>
        <div className="cta-container">
          <button className="btn modify" onClick={handleModify}>
            ✏️
          </button>
          <button className="btn cancel" onClick={handleCancel}>
            🗑️
          </button>
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
