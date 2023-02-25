import { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import { formatDate } from "../../../utils/dateFunctions";
import { ITournamentRegistration } from "../../../interfaces/interfaces";
import { mutate } from "swr";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";

interface ITournamentRegistrationProps {
  tournamentRegistration: ITournamentRegistration;
  displayOnMobile: boolean;
  setFocusedRegistration: Dispatch<SetStateAction<ITournamentRegistration>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

const TournamentRegistration = ({
  tournamentRegistration,
  displayOnMobile,
  setIsModalActive,
  setFocusedRegistration,
  setRequestMessage,
}: ITournamentRegistrationProps) => {
  const axiosPrivate = useAxiosPrivate();
  const { user } = useContext(AuthenticationContext);

  const handleModify = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedRegistration(tournamentRegistration);
    setIsModalActive(true);
  };

  const handleCancel = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await mutate(
      "tournament-registrations",
      await axiosPrivate
        .patch(`tournament-registration/cancel/${tournamentRegistration.id}`)
        .then((res) => {
          setRequestMessage({
            error: "",
            success: "Votre demande d'inscription a bien été annulée ! 👌",
          });
          return res.data;
        })
        .catch((err) => {
          // console.error(err)
          setRequestMessage({
            error:
              "Une erreur est survenue lors de l'annulation de votre demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur.",
            success: "",
          });
        }),
      {
        optimisticData: (tournamentsRegistrations: Array<ITournamentRegistration>) => {
          const prev = tournamentsRegistrations.filter(
            (registration: ITournamentRegistration) => registration.id !== tournamentRegistration.id
          );
          return [...prev, { ...tournamentRegistration, requestState: "cancelled" }];
        },
        populateCache: (
          tournamentRegistration: ITournamentRegistration,
          tournamentsRegistrations: Array<ITournamentRegistration>
        ) => {
          const prev = tournamentsRegistrations.filter(
            (registration: ITournamentRegistration) => registration.id !== tournamentRegistration.id
          );
          return [...prev, tournamentRegistration];
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
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
        <button
          className="btn modify"
          onClick={handleModify}
          disabled={
            new Date(
              tournamentRegistration.tournament?.startDate ||
                tournamentRegistration.tournamentStartDate
            ) <= new Date()
          }
        >
          ✏️
        </button>
        <button
          className="btn cancel"
          onClick={handleCancel}
          disabled={
            new Date(
              tournamentRegistration.tournament?.startDate ||
                tournamentRegistration.tournamentStartDate
            ) <= new Date() || tournamentRegistration.requestState === "cancelled"
          }
        >
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
        <div className="cta-container">
          <button
            className="btn modify"
            onClick={handleModify}
            disabled={
              new Date(
                tournamentRegistration.tournament?.startDate ||
                  tournamentRegistration.tournamentStartDate
              ) <= new Date()
            }
          >
            ✏️
          </button>
          <button
            className="btn cancel"
            onClick={handleCancel}
            disabled={
              new Date(
                tournamentRegistration.tournament?.startDate ||
                  tournamentRegistration.tournamentStartDate
              ) <= new Date() || tournamentRegistration.requestState === "cancelled"
            }
          >
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
