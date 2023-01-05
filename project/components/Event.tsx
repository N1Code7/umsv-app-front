import { formatDate, getDayOfWeek } from "../../config/functions";
import { IClubEvent } from "../../config/interfaces";

interface IEventProps {
  event: IClubEvent;
}

const Event = ({ event }: IEventProps) => {
  const handleClick = () => {};

  return (
    <button className="event" onClick={handleClick}>
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
  );
};

export default Event;
