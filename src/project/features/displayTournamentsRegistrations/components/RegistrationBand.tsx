import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import { formatDate } from "../../../../utils/dateFunctions";
import { mutate, preload } from "swr";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

interface IProps {
  tournamentRegistration: ITournamentRegistration;
  setFocusedRegistration: Dispatch<SetStateAction<ITournamentRegistration>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

const RegistrationBand = ({
  tournamentRegistration,
  setFocusedRegistration,
  setIsModalActive,
  setRequestMessage,
}: IProps) => {
  //
  const axiosPrivate = useAxiosPrivate();
  const [toggleChevron, setToggleChevron] = useState("down");

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleChevron === "down" ? setToggleChevron("up") : setToggleChevron("down");
  };

  const handleModify = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedRegistration?.(tournamentRegistration);
    setIsModalActive?.(true);
  };

  const handleValidate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //
    await mutate(
      `/admin/tournament-registrations`,
      await axiosPrivate
        .patch(`/admin/tournament-registration/validate/${tournamentRegistration.id}`, {
          requestState: "validated",
        })
        .then((res) => {
          setRequestMessage({ success: "La demande d'inscription a bien été validée.", error: "" });
          return res.data;
        })
        .catch((err) => {
          // console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de la validation de la demande d'inscription",
          });
        }),
      {
        optimisticData: (registrations: Array<ITournamentRegistration>) => {
          const prev = registrations.filter(
            (registration: ITournamentRegistration) => registration.id !== tournamentRegistration.id
          );
          return [...prev, { ...tournamentRegistration, requestState: "validated" }];
        },
        populateCache: (
          newRegistration: ITournamentRegistration,
          registrations: Array<ITournamentRegistration>
        ) => {
          const prev = registrations.filter(
            (reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id
          );
          return [...prev, newRegistration];
        },
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
    // window.scrollTo(0, 0);
  };

  const handleCancel = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //
    await mutate(
      `/admin/tournament-registrations`,
      axiosPrivate
        .patch(`/admin/tournament-registration/cancel/${tournamentRegistration.id}`, {
          requestState: "cancelled",
        })
        .then((res) => {
          setRequestMessage({ success: "La demande d'inscription a bien été annulée.", error: "" });
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de l'annulation de la demande d'inscription.",
          });
        }),
      {
        optimisticData: (registrations: Array<ITournamentRegistration>) => {
          const prev = registrations.filter(
            (registration: ITournamentRegistration) => registration.id !== tournamentRegistration.id
          );
          return [...prev, { ...tournamentRegistration, requestState: "cancelled" }];
        },
        populateCache: (
          newRegistration: ITournamentRegistration,
          registrations: Array<ITournamentRegistration>
        ) => {
          const prev = registrations.filter(
            (reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id
          );
          return [...prev, newRegistration];
        },
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
    // window.scrollTo(0, 0);
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //
    mutate(
      "/admin/tournament-registrations",
      axiosPrivate
        .delete(`/admin/tournament-registration/${tournamentRegistration.id}`)
        .then((res) => {
          console.log(res.data);
          setRequestMessage({
            success: "La demande d'inscription a bien été supprimée.",
            error: "",
          });
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de la suppression de la demande d'inscription.",
          });
        }),
      {
        optimisticData: (registrations: Array<ITournamentRegistration>) =>
          registrations.filter(
            (reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id
          ),
        populateCache: (
          newRegistration: ITournamentRegistration,
          allRegistrations: Array<ITournamentRegistration>
        ) =>
          allRegistrations.filter(
            (reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id
          ),
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
    // window.scrollTo(0, 0);
  };

  return (
    <div
      className="band registration"
      style={toggleChevron === "down" && window.innerWidth > 1000 ? { rowGap: 0 } : undefined}
    >
      <div className="registration-date">
        Demande du{" "}
        {formatDate(
          tournamentRegistration.updatedAt || tournamentRegistration.createdAt,
          undefined
        )}
      </div>

      <div className="identity">
        {tournamentRegistration.user?.firstName || tournamentRegistration.userFirstName}{" "}
        {tournamentRegistration.user?.lastName || tournamentRegistration.userLastName}
      </div>

      <div
        className="details"
        style={
          toggleChevron === "down"
            ? { maxHeight: 0, opacity: 0, margin: 0, zIndex: "-1" }
            : { maxHeight: 500, opacity: 1, marginTop: "0.5rem", marginBottom: "0.5rem", zIndex: 0 }
        }
      >
        <i className="fa-solid fa-font"></i>
        <div className="tournament-name">
          {tournamentRegistration.tournament?.name ||
            tournamentRegistration.tournamentName ||
            undefined}
        </div>

        <i className="fa-solid fa-city"></i>
        <div className="tournament-city">
          {tournamentRegistration.tournament?.city || tournamentRegistration.tournamentCity}
        </div>

        <i className="fa-solid fa-calendar-days"></i>
        <div className="tournament-dates">
          {tournamentRegistration.tournament?.endDate || tournamentRegistration.tournamentEndDate
            ? formatDate(
                tournamentRegistration.tournament?.startDate ||
                  tournamentRegistration.tournamentStartDate,
                tournamentRegistration.tournament?.endDate ||
                  tournamentRegistration.tournamentEndDate,
                "XX & XX xxx XXXX"
              )
            : formatDate(
                tournamentRegistration?.tournament?.startDate ||
                  tournamentRegistration?.tournamentStartDate,
                undefined,
                "XX xxx XXXX"
              )}
        </div>

        {tournamentRegistration.participationSingle && (
          <>
            <i className="fa-solid fa-user"></i>
            <div className="single">Simple : oui</div>
          </>
        )}

        {tournamentRegistration.participationDouble && (
          <>
            <i className="fa-solid fa-user-group"></i>
            <div className="double">
              Double : {tournamentRegistration.doublePartnerName || "X"}
              {tournamentRegistration.doublePartnerClub
                ? " / " + tournamentRegistration.doublePartnerClub
                : ""}
            </div>
          </>
        )}

        {tournamentRegistration.participationMixed && (
          <>
            <i className="fa-solid fa-user-group"></i>
            <div className="mixed">
              Mixte : {tournamentRegistration.mixedPartnerName || "X"}
              {tournamentRegistration.mixedPartnerClub
                ? " / " + tournamentRegistration.mixedPartnerClub
                : ""}
            </div>
          </>
        )}

        <i className="fa-solid fa-comment-dots"></i>
        <div className="comment">{tournamentRegistration.comment || "Aucun commentaire"}</div>
      </div>

      <div className="cta-container">
        <button onClick={handleModify}>✏️</button>
        <button
          style={{ display: tournamentRegistration.requestState === "validated" ? "none" : "flex" }}
          onClick={handleValidate}
        >
          ✅
        </button>
        <button
          style={{ display: tournamentRegistration.requestState === "cancelled" ? "none" : "flex" }}
          onClick={handleCancel}
        >
          ↩️
        </button>
        <button onClick={handleDelete}>🗑️</button>
      </div>

      <button onClick={handleClick}>
        <i className={`fa-solid fa-chevron-${toggleChevron}`}></i>
      </button>
    </div>
  );
};

export default RegistrationBand;
