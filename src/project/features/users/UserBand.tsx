import { Dispatch, MouseEvent, SetStateAction, useContext, useEffect, useState } from "react";
import { ITournamentRegistration, IUser } from "../../../interfaces/interfaces";
import { formatDate } from "../../../utils/dateFunctions";
import { mutate, preload } from "swr";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";

interface IProps {
  user: IUser;
  setFocusedUser: Dispatch<SetStateAction<IUser>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
  setPatchMethod: Dispatch<SetStateAction<boolean>>;
}

const UserBand = ({
  user,
  setFocusedUser,
  setIsModalActive,
  setRequestMessage,
  setPatchMethod,
}: IProps) => {
  //
  const { user: connectedUser } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();
  const [toggleChevron, setToggleChevron] = useState("down");

  const handleClick = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.preventDefault();
    if (e.target !== document.querySelector(".cta-container button"))
      toggleChevron === "down" ? setToggleChevron("up") : setToggleChevron("down");
    e.stopPropagation();
  };

  const handleModify = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedUser?.(user);
    setIsModalActive?.(true);
    setPatchMethod?.(true);
  };

  // const handleValidate = async (e: MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   //
  //   await mutate(
  //     `/admin/users`,
  //     await axiosPrivate
  //       .patch(`/admin/user/validate/${user.id}`, {
  //         requestState: "validated",
  //       })
  //       .then((res) => {
  //         setRequestMessage({ success: "La demande d'inscription a bien été validée.", error: "" });
  //         return res.data;
  //       })
  //       .catch((err) => {
  //         // console.error(err);
  //         setRequestMessage({
  //           success: "",
  //           error: "Une erreur est survenue lors de la validation de la demande d'inscription",
  //         });
  //       }),
  //     {
  //       optimisticData: (registrations: Array<ITournamentRegistration>) => {
  //         const prev = registrations.filter(
  //           (registration: ITournamentRegistration) => registration.id !== user.id
  //         );
  //         return [...prev, { ...user, requestState: "validated" }].sort(
  //           (a: ITournamentRegistration, b: ITournamentRegistration) =>
  //             Number(new Date(b.updatedAt || b.createdAt)) -
  //             Number(new Date(a.updatedAt || a.createdAt))
  //         );
  //       },
  //       populateCache: (
  //         newRegistration: ITournamentRegistration,
  //         registrations: Array<ITournamentRegistration>
  //       ) => {
  //         const prev = registrations.filter(
  //           (reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id
  //         );
  //         return [...prev, newRegistration];
  //       },
  //       revalidate: false,
  //       rollbackOnError: true,
  //     }
  //   );

  //   setTimeout(() => {
  //     setRequestMessage({ success: "", error: "" });
  //   }, 10000);
  //   // window.scrollTo(0, 0);
  // };

  // const handleCancel = async (e: MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   //
  //   await mutate(
  //     `/admin/tournament-registrations`,
  //     axiosPrivate
  //       .patch(`/admin/tournament-registration/cancel/${tournamentRegistration.id}`, {
  //         requestState: "cancelled",
  //       })
  //       .then((res) => {
  //         setRequestMessage({ success: "La demande d'inscription a bien été annulée.", error: "" });
  //         return res.data;
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         setRequestMessage({
  //           success: "",
  //           error: "Une erreur est survenue lors de l'annulation de la demande d'inscription.",
  //         });
  //       }),
  //     {
  //       optimisticData: (registrations: Array<ITournamentRegistration>) => {
  //         const prev = registrations.filter(
  //           (registration: ITournamentRegistration) => registration.id !== tournamentRegistration.id
  //         );
  //         return [...prev, { ...tournamentRegistration, requestState: "cancelled" }].sort(
  //           (a: ITournamentRegistration, b: ITournamentRegistration) =>
  //             Number(new Date(b.updatedAt || b.createdAt)) -
  //             Number(new Date(a.updatedAt || a.createdAt))
  //         );
  //       },
  //       populateCache: (
  //         newRegistration: ITournamentRegistration,
  //         registrations: Array<ITournamentRegistration>
  //       ) => {
  //         const prev = registrations.filter(
  //           (reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id
  //         );
  //         return [...prev, newRegistration];
  //       },
  //       revalidate: false,
  //       rollbackOnError: true,
  //     }
  //   );

  //   setTimeout(() => {
  //     setRequestMessage({ success: "", error: "" });
  //   }, 10000);
  //   // window.scrollTo(0, 0);
  // };

  // const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   //
  //   mutate(
  //     "/admin/tournament-registrations",
  //     axiosPrivate
  //       .delete(`/admin/tournament-registration/${tournamentRegistration.id}`)
  //       .then((res) => {
  //         console.log(res.data);
  //         setRequestMessage({
  //           success: "La demande d'inscription a bien été supprimée.",
  //           error: "",
  //         });
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         setRequestMessage({
  //           success: "",
  //           error: "Une erreur est survenue lors de la suppression de la demande d'inscription.",
  //         });
  //       }),
  //     {
  //       optimisticData: (registrations: Array<ITournamentRegistration>) =>
  //         registrations
  //           .filter((reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id)
  //           .sort(
  //             (a: ITournamentRegistration, b: ITournamentRegistration) =>
  //               Number(new Date(b.updatedAt || b.createdAt)) -
  //               Number(new Date(a.updatedAt || a.createdAt))
  //           ),
  //       populateCache: (
  //         newRegistration: ITournamentRegistration,
  //         allRegistrations: Array<ITournamentRegistration>
  //       ) =>
  //         allRegistrations.filter(
  //           (reg: ITournamentRegistration) => reg.id !== tournamentRegistration.id
  //         ),
  //       revalidate: false,
  //       rollbackOnError: true,
  //     }
  //   );

  //   setTimeout(() => {
  //     setRequestMessage({ success: "", error: "" });
  //   }, 10000);
  //   // window.scrollTo(0, 0);
  // };

  return (
    <div
      className="band user"
      id="userBand"
      style={toggleChevron === "down" && window.innerWidth > 1000 ? { rowGap: 0 } : undefined}
      onClick={handleClick}
      // onClick={() => (toggleChevron === "down" ? setToggleChevron("up") : setToggleChevron("down"))}
    >
      <div className="user-identity">{user.firstName + " " + user.lastName}</div>

      {/* <div className="user-date">
        Demande du{" "}
        {formatDate(
          tournamentRegistration.updatedAt || tournamentRegistration.createdAt,
          undefined
        )}
      </div>

      <div className="identity">
        {tournamentRegistration.user?.firstName || tournamentRegistration.userFirstName}{" "}
        {tournamentRegistration.user?.lastName || tournamentRegistration.userLastName}
      </div> */}

      <div
        className="details"
        style={
          toggleChevron === "down"
            ? { maxHeight: 0, opacity: 0, margin: 0, zIndex: "-1" }
            : { maxHeight: 500, opacity: 1, marginTop: "0.5rem", marginBottom: "0.5rem", zIndex: 0 }
        }
      >
        {/* <i className="fa-solid fa-font"></i>
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
                String(
                  tournamentRegistration.tournament?.startDate ||
                    tournamentRegistration.tournamentStartDate
                ),
                String(
                  tournamentRegistration.tournament?.endDate ||
                    tournamentRegistration.tournamentEndDate
                ),
                "XX & XX xxx XXXX"
              )
            : formatDate(
                String(
                  tournamentRegistration?.tournament?.startDate ||
                    tournamentRegistration?.tournamentStartDate
                ),
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
        <div className="comment">{tournamentRegistration.comment || "Aucun commentaire"}</div> */}
      </div>

      {!connectedUser?.roles.includes("ROLE_SUPERADMIN") &&
        (user.roles.toString() === ["ROLE_MEMBER"].toString() ||
          connectedUser?.id === user?.id) && (
          // (!user.roles.includes("ROLE_SUPERADMIN") || !user.roles.includes("ROLE_ADMIN")) && (
          <div className="cta-container">
            <button className="btn btn-modify" onClick={handleModify}>
              ✏️
            </button>
            <button
              className="btn btn-success"
              style={{ display: user.state === "validated" ? "none" : "flex" }}
              // onClick={handleValidate}
            >
              ✅
            </button>
            <button
              className="btn btn-cancel"
              style={{ display: user.state === "cancelled" ? "none" : "flex" }}
              // onClick={handleCancel}
            >
              ↩️
            </button>
            <button
              className="btn btn-delete"
              // onClick={handleDelete}
            >
              🗑️
            </button>
          </div>
        )}

      <button onClick={handleClick}>
        <i className={`fa-solid fa-chevron-${toggleChevron}`}></i>
      </button>
    </div>
  );
};

export default UserBand;
