import { Dispatch, MouseEvent, SetStateAction, useEffect } from "react";
import { IClubEvent } from "../../interfaces/interfaces";
import { formatDate, getDayOfWeek } from "../../utils/functions/dateFunctions";

interface IEventProps {
  event: IClubEvent;
  isModalActive: boolean;
  focusedEvent: IClubEvent;
  setFocusedEvent: Dispatch<SetStateAction<IClubEvent>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
}

const Event = ({
  event,
  focusedEvent,
  setFocusedEvent,
  isModalActive,
  setIsModalActive,
}: IEventProps) => {
  const handleDisplayModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedEvent(event);
    setIsModalActive(true);
  };

  useEffect(() => {
    isModalActive &&
      document.body.querySelector(".modal-backdrop")?.addEventListener("click", () => {
        setFocusedEvent({} as IClubEvent);
      });

    document.body
      .querySelector(".events")
      ?.setAttribute(
        "style",
        `animation-play-state: ${
          isModalActive && focusedEvent !== ({} as IClubEvent) ? "paused" : "running"
        };`
      );
  }, [isModalActive, focusedEvent, setFocusedEvent]);

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
