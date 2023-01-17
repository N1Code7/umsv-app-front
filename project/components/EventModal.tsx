import { Dispatch, MouseEvent, SetStateAction } from "react";
import { IClubEvent } from "../../config/interfaces";
import Image from "next/image";
import { formatDate, getDayOfWeek } from "../../config/dateFunctions";

interface IProps {
  isModalActive: boolean;
  focusedEvent: IClubEvent;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setFocusedEvent: Dispatch<SetStateAction<IClubEvent>>;
}

const EventModal = ({ isModalActive, setIsModalActive, focusedEvent }: IProps) => {
  const handleCloseModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalActive(false);
  };

  return (
    <>
      <div className="event-modal-backdrop"></div>
      <div
        className="event-modal"
        style={
          isModalActive
            ? window.innerWidth < 1000
              ? { display: "block" }
              : { display: "grid" }
            : { display: "none" }
        }
      >
        <button className="close-btn" onClick={handleCloseModal}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="title">
          {focusedEvent.endDate ? (
            <h2>
              Du{" "}
              <span>
                {getDayOfWeek(focusedEvent.startDate)}{" "}
                {formatDate(focusedEvent.startDate, "XX/XX/XX")}
              </span>{" "}
              au{" "}
              <span>
                {getDayOfWeek(focusedEvent.endDate)} {formatDate(focusedEvent.endDate, "XX/XX/XX")}
              </span>
            </h2>
          ) : (
            <h2>
              Le{" "}
              <span>
                {getDayOfWeek(focusedEvent.startDate, "long")}{" "}
                {formatDate(focusedEvent.startDate, "XX/XX/XX")}
              </span>
            </h2>
          )}
        </div>
        <div className="image">
          {
            <Image
              src={focusedEvent.imageUrl}
              alt={`image de l'événement du ${getDayOfWeek(
                focusedEvent.startDate,
                "long"
              )} ${formatDate(focusedEvent.startDate, "XX/XX/XX")}`}
              fill
              sizes=""
            />
          }
        </div>
        <div className="content">{focusedEvent.content}</div>
      </div>
    </>
  );
};

export default EventModal;
