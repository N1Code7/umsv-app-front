import { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import { formatDate } from "../../config/dateFunctions";
import { ITournamentRegistration } from "../../config/interfaces";
import { fetchCancelUserRegistration, fetchRefreshToken } from "../../config/fetchFunctions";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

interface ITournamentRegistrationProps {
  tournamentRegistration: ITournamentRegistration;
  displayOnMobile: boolean;
  setFocusedRegistration: Dispatch<SetStateAction<ITournamentRegistration>>;
  setCheckboxDouble: Dispatch<SetStateAction<boolean>>;
  setCheckboxMixed: Dispatch<SetStateAction<boolean>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setChooseExistingTournament: Dispatch<SetStateAction<boolean>>;
}

const TournamentRegistration = ({
  tournamentRegistration,
  displayOnMobile,
  setIsModalActive,
  setFocusedRegistration,
  setCheckboxDouble,
  setCheckboxMixed,
  setChooseExistingTournament,
}: ITournamentRegistrationProps) => {
  const { setAuth } = useContext(AuthenticationContext);

  const handleModify = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    tournamentRegistration.tournament === null
      ? setChooseExistingTournament(false)
      : setChooseExistingTournament(true);
    setFocusedRegistration(tournamentRegistration);
    setCheckboxDouble(tournamentRegistration.participationDouble);
    setCheckboxMixed(tournamentRegistration.participationMixed);
    setIsModalActive(true);
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
      .then((res) => setFocusedRegistration(res))
      .catch((err) => console.error(err));
  };

  return displayOnMobile ? (
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
    </div>
  ) : (
    <tr>
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
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
        {tournamentRegistration.tournament && tournamentRegistration.tournament.name}
      </td>
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
      <td
        style={
          tournamentRegistration.requestState === "cancelled"
            ? { textDecoration: "line-through", textDecorationThickness: 2 }
            : {}
        }
      >
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
