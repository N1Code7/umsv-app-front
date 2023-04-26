import { MouseEvent, useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { IClubEvent } from "../../../../interfaces/interfaces";
import useSWR from "swr";
import { sleep } from "../../../../utils/globals";
import Modal from "../../../components/Modal";
import EventForm from "../../../features/events/EventForm";
import EventBand from "../../../features/events/EventBand";

interface IProps {}

const AdminEventsHandle = ({}: IProps) => {
  //
  const axiosPrivate = useAxiosPrivate();
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });
  const [patchMethod, setPatchMethod] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedEvent, setFocusedEvent] = useState({} as IClubEvent);

  const { data: events, isLoading: eventsLoading } = useSWR("/events", async (url) =>
    sleep(2000)
      .then(() => axiosPrivate.get(url))
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
      })
  );

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPatchMethod(false);
    setIsModalActive?.(true);
    setFocusedEvent({} as IClubEvent);
  };

  return (
    <main className="admin-space">
      {requestMessage.success !== "" && (
        <div className="notification-message">
          <p className="success">{requestMessage.success}</p>
        </div>
      )}
      {requestMessage.error !== "" && (
        <div className="notification-message">
          <p className="error">{requestMessage.error}</p>
        </div>
      )}

      <h1>Gestion des événements</h1>

      <div className="global-actions">
        <button className="btn btn-primary" onClick={handleClick}>
          Créer un événement
        </button>
      </div>

      <div className="list events-list">
        {eventsLoading ? (
          <p>Chargement des événements</p>
        ) : (
          // events.map((event: IClubEvent) => <p key={event.id}>{event.content}</p>)
          events
            ?.sort(
              (a: IClubEvent, b: IClubEvent) =>
                Number(new Date(b.updatedAt || b.createdAt)) -
                Number(new Date(a.updatedAt || a.createdAt))
            )
            .map((event: IClubEvent) => (
              <EventBand
                key={event.id}
                event={event}
                setFocusedEvent={setFocusedEvent}
                setIsModalActive={setIsModalActive}
                setPatchMethod={setPatchMethod}
                setRequestMessage={setRequestMessage}
              />
            ))
        )}
      </div>

      {isModalActive && (
        <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
          <div className="modal-content modal-registration">
            <div className="title">
              <h2>Modification inscription :</h2>
            </div>

            <EventForm
              patchMethod={patchMethod}
              setRequestMessage={setRequestMessage}
              focusedEvent={focusedEvent}
              setIsModalActive={setIsModalActive}
            />
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AdminEventsHandle;
