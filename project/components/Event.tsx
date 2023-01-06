import { MouseEvent, useEffect, useState } from "react";
import { formatDate, getDayOfWeek } from "../../config/functions";
import { IClubEvent } from "../../config/interfaces";
import Image from "next/image";

interface IEventProps {
  event: IClubEvent;
}

const Event = ({ event }: IEventProps) => {
  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleDisplayModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setModalIsActive(!modalIsActive);
  };

  useEffect(() => {
    if (modalIsActive) {
      document.body.querySelector(".event-modal-backdrop")?.addEventListener("click", (e) => {
        setModalIsActive(false);
      });
    }
    document.body
      .querySelector(".events")
      ?.setAttribute("style", `animation-play-state: ${modalIsActive ? "paused" : "running"};`);
  }, [modalIsActive]);

  return (
    <>
      {event ? (
        <button className="event" onClick={toggleDisplayModal}>
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

      {modalIsActive && (
        <>
          <div className="event-modal-backdrop"></div>
          <div
            className="event-modal"
            style={modalIsActive ? { display: "block" } : { display: "none" }}
          >
            <button className="close-btn" onClick={toggleDisplayModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="title">
              {event.endDate ? (
                <h2>
                  Du{" "}
                  <span>
                    {getDayOfWeek(event.startDate)} {formatDate(event.startDate, "XX/XX/XX")}
                  </span>{" "}
                  au{" "}
                  <span>
                    {getDayOfWeek(event.endDate)} {formatDate(event.endDate, "XX/XX/XX")}
                  </span>
                </h2>
              ) : (
                <h2>
                  Le{" "}
                  <span>
                    {getDayOfWeek(event.startDate, "long")}{" "}
                    {formatDate(event.startDate, "XX/XX/XX")}
                  </span>
                </h2>
              )}
            </div>
            <div className="image">
              {
                <Image
                  src={event.imageUrl}
                  alt={`image de l'événement du ${getDayOfWeek(
                    event.startDate,
                    "long"
                  )} ${formatDate(event.startDate, "XX/XX/XX")}`}
                  fill
                />
              }
            </div>
            <div className="content">{event.content}</div>
          </div>
        </>
      )}
    </>
  );
};

export default Event;
