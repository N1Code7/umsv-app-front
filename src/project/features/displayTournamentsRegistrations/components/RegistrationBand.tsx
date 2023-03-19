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
      <div className="tournament-city">
        {registration.tournament?.city || registration.tournamentCity}
      </div>
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
      <div
        className="details"
        style={
          toggleChevron === "down" ? { maxHeight: 0, opacity: 0 } : { maxHeight: 500, opacity: 1 }
        }
      >
        <div className="tournament-name">
          {registration.tournament?.name || registration.tournamentName || undefined}
        </div>
        {registration.participationSingle && <div className="single">Simple : oui</div>}
        {registration.participationDouble && (
          <div className="double">
            Double : {registration.doublePartnerName || "X"} /{" "}
            {registration.doublePartnerClub || ""}
          </div>
        )}
        {registration.participationMixed && (
          <div className="mixed">
            Mixte : {registration.mixedPartnerName || "X"} / {registration.mixedPartnerClub || ""}
          </div>
        )}
        <div className="comment">{registration.comment || "Aucun commentaire"}</div>
      </div>
      <AdminRegistrationCTA
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
