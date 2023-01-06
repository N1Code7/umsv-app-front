import { MouseEvent, useContext, useEffect, useState } from "react";
import { formatDate, getDayOfWeek } from "../../config/functions";
import { IClubEvent } from "../../config/interfaces";
import Image from "next/image";
import { ModalEventContext } from "../../contexts/ModalEventContext";

interface IEventProps {
  event: IClubEvent;
}

const Event = ({ event }: IEventProps) => {
  const { setFocusedEvent, isModalActive, setIsModalActive } = useContext(ModalEventContext);

  const handleDisplayModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedEvent?.(event);
    setIsModalActive?.(true);
  };

  useEffect(() => {
    if (isModalActive) {
      document.body.querySelector(".event-modal-backdrop")?.addEventListener("click", (e) => {
        setFocusedEvent?.({});
        setIsModalActive?.(false);
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
                  {getDayOfWeek(event.startDate)} {formatDate(event.startDate, "XX/XX/XX")}
                </span>{" "}
                au{" "}
                <span>
                  {getDayOfWeek(event.endDate)} {formatDate(event.endDate, "XX/XX/XX")}
                </span>
              </>
            ) : (
              <>
                Le{" "}
                <span>
                  {getDayOfWeek(event.startDate, "long")} {formatDate(event.startDate, "XX/XX/XX")}
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
