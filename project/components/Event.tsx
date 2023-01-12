import { Dispatch, MouseEvent, SetStateAction, useEffect } from "react";
import { formatDate, getDayOfWeek } from "../../config/functions";
import { IClubEvent } from "../../config/interfaces";

interface IEventProps {
  event: IClubEvent;
  isModalActive: boolean;
  setFocusedEvent: Dispatch<SetStateAction<IClubEvent>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
}

const Event = ({ event, setFocusedEvent, isModalActive, setIsModalActive }: IEventProps) => {
  const handleDisplayModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedEvent(event);
    setIsModalActive(true);
  };

  useEffect(() => {
    if (isModalActive) {
      document.body.querySelector(".event-modal-backdrop")?.addEventListener("click", (e) => {
        setFocusedEvent({} as IClubEvent);
        setIsModalActive(false);
      });
    }
    document.body
      .querySelector(".events")
      ?.setAttribute("style", `animation-play-state: ${isModalActive ? "paused" : "running"};`);
  }, [isModalActive, setFocusedEvent, setIsModalActive]);

  return (
    <>
      {event ? (
        <button className="event" onClick={handleDisplayModal}>
          <div className="event-date">
            {event.endDate ? (
              <>
                Du{" "}
                <span>
                  {getDayOfWeek(event.startDate)}{" "}
                  {formatDate(event.startDate, undefined, "XX/XX/XX")}
                </span>{" "}
                au{" "}
                <span>
                  {getDayOfWeek(event.endDate)} {formatDate(event.endDate, undefined, "XX/XX/XX")}
                </span>
              </>
            ) : (
              <>
                Le{" "}
                <span>
                  {getDayOfWeek(event.startDate, "long")}{" "}
                  {formatDate(event.startDate, undefined, "XX/XX/XX")}
                </span>
              </>
            )}
          </div>
          <div className="event-content">
            <p>{event.content}</p>
          </div>
        </button>
      ) : (
        "Aucun événement à venir"
      )}
    </>
  );
};

export default Event;
