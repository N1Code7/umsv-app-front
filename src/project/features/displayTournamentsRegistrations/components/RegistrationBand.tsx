import { MouseEvent, useState } from "react";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import { formatDate } from "../../../../utils/dateFunctions";
import AdminRegistrationCTA from "./AdminRegistrationCTA";

interface IProps {
  registration: ITournamentRegistration;
  handleModify: (e: MouseEvent<HTMLButtonElement>) => {};
  handleValidate: (e: MouseEvent<HTMLButtonElement>) => {};
  handleCancel: (e: MouseEvent<HTMLButtonElement>) => {};
  handleRemove: (e: MouseEvent<HTMLButtonElement>) => {};
}

const RegistrationBand = ({
  registration,
  handleCancel,
  handleModify,
  handleRemove,
  handleValidate,
}: IProps) => {
  //
  const [toggleChevron, setToggleChevron] = useState("down");
  const [isModifying, setIsModifying] = useState(true);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleChevron === "down" ? setToggleChevron("up") : setToggleChevron("down");
  };

  return (
    <div className="band registration">
      <div className="registration-date">
        Demande du {formatDate(registration.updatedAt || registration.createdAt, undefined)}
      </div>
      <div className="identity">
        {registration.user?.firstName || registration.userFirstName}{" "}
        {registration.user?.lastName || registration.userLastName}
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
          {registration.tournament?.name || registration.tournamentName || undefined}
        </div>
        <i className="fa-solid fa-city"></i>
        <div className="tournament-city">
          {registration.tournament?.city || registration.tournamentCity}
        </div>
        <i className="fa-solid fa-calendar-days"></i>
        <div className="tournament-dates">
          {registration.tournament?.endDate || registration.tournamentEndDate
            ? formatDate(
                registration.tournament?.startDate || registration.tournamentStartDate,
                registration.tournament?.endDate || registration.tournamentEndDate,
                "XX & XX xxx XXXX"
              )
            : formatDate(
                registration.tournament?.startDate || registration.tournamentStartDate,
                undefined,
                "XX xxx XXXX"
              )}
        </div>
        {registration.participationSingle && (
          <>
            <i className="fa-solid fa-user"></i>
            <div className="single">Simple : oui</div>
          </>
        )}
        {registration.participationDouble && (
          <>
            <i className="fa-solid fa-user-group"></i>
            <div className="double">
              Double : {registration.doublePartnerName || "X"} /{" "}
              {registration.doublePartnerClub || ""}
            </div>
          </>
        )}
        {registration.participationMixed && (
          <>
            <i className="fa-solid fa-user-group"></i>
            <div className="mixed">
              Mixte : {registration.mixedPartnerName || "X"} / {registration.mixedPartnerClub || ""}
            </div>
          </>
        )}
        <i className="fa-solid fa-comment-dots"></i>
        <div className="comment">{registration.comment || "Aucun commentaire"}</div>
      </div>
      <AdminRegistrationCTA
        registration={registration}
        handleCancel={handleCancel}
        handleModify={handleModify}
        handleRemove={handleRemove}
        handleValidate={handleValidate}
      />
      <button onClick={handleClick}>
        <i className={`fa-solid fa-chevron-${toggleChevron}`}></i>
      </button>
    </div>
  );
};

export default RegistrationBand;
