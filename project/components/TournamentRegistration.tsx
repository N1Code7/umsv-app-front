import { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import { formatDate } from "../../config/dateFunctions";
import { ITournamentRegistration } from "../../config/interfaces";
import { mutate } from "swr";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

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
  const axiosPrivate = useAxiosPrivate();

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
    try {
      mutate(
        "tournament-registrations",
        await axiosPrivate
          .patch(`tournament-registration/cancel/${tournamentRegistration.id}`)
          .then((res) => res.data)
          .catch((err) => console.error(err)),
        {
          optimisticData: (tournamentsRegistrations: Array<ITournamentRegistration>) => {
            const prev = tournamentsRegistrations.filter(
              (registration: ITournamentRegistration) =>
                registration.id !== tournamentRegistration.id
            );
            return [...prev, { ...tournamentRegistration, requestState: "cancelled" }];
          },
          populateCache: (
            tournamentRegistration: ITournamentRegistration,
            tournamentsRegistrations: Array<ITournamentRegistration>
          ) => {
            const prev = tournamentsRegistrations.filter(
              (registration: ITournamentRegistration) =>
                registration.id !== tournamentRegistration.id
            );
            return [...prev, tournamentRegistration];
          },
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return displayOnMobile ? (
    /** MOBILE */
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
    /** DESKTOP */
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
            tournamentRegistration.user.gender === "male" ? (
              <span>DH : {tournamentRegistration.doublePartnerName}</span>
            ) : (
              <span>DD : {tournamentRegistration.doublePartnerName}</span>
            )
          ) : (
            <span>Double : {tournamentRegistration.doublePartnerName}</span>
          ))}
        {tournamentRegistration.participationMixed === true &&
          (tournamentRegistration.user?.gender ? (
            <span>DX : {tournamentRegistration.mixedPartnerName}</span>
          ) : (
            <span>Mixte : {tournamentRegistration.mixedPartnerName}</span>
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
