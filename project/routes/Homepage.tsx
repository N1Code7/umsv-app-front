import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import { fetchEvents, formatDate, getDayOfWeek } from "../../config/functions";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Event from "../components/Event";
import { IClubEvent } from "../../config/interfaces";
import { ModalEventContext } from "../../contexts/ModalEventContext";
import Image from "next/image";

const Homepage = () => {
  const { authToken } = useContext(AuthenticationContext);
  const { focusedEvent, setFocusedEvent, isModalActive, setIsModalActive } =
    useContext(ModalEventContext);
  const [events, setEvents] = useState([]);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const modal = document.body.querySelector(".event-modal");
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (window.innerWidth < 1000) {
          setDisplay("mobile");
        } else {
          setDisplay("desktop");
        }
      });
    });

    if (modal) observer.observe(modal);
  }, [display]);

  const handleCloseModal = (e: MouseEvent<HTMLButtonElement>) => {
    setFocusedEvent?.({});
    setIsModalActive?.(false);
  };

  useEffect(() => {
    fetchEvents(authToken!)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("An error occurs when try to fetch events!");
      })
      .then((res) => setEvents(res));
  }, [authToken]);

  return (
    <>
      <Header />
      <MemberHeader />
      <Navigation />
      <main className="homepage">
        <div className="events-block">
          <h2>Événements à venir</h2>
          <div className="events">
            {events
              .filter((event: IClubEvent) => {
                const startDate = new Date(event.startDate);
                const today = new Date();
                return startDate > today;
              })
              .sort((a: IClubEvent, b: IClubEvent) => {
                const firstDate = new Date(a.startDate);
                const secondDate = new Date(b.startDate);
                return Number(firstDate) - Number(secondDate);
              })
              .slice(0, 5)
              .map((event: IClubEvent) => (
                <Event key={event.id} event={event} />
              ))}
          </div>
        </div>
        <div className="tournaments-list">
          <h2>Tournois référencés par le club</h2>
          <div className="tournaments-block"></div>
        </div>
        {/* <Modal /> */}
      </main>
      {isModalActive && (
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
              {focusedEvent?.endDate ? (
                <h2>
                  Du{" "}
                  <span>
                    {getDayOfWeek(focusedEvent.startDate!)}{" "}
                    {formatDate(focusedEvent.startDate!, "XX/XX/XX")}
                  </span>{" "}
                  au{" "}
                  <span>
                    {getDayOfWeek(focusedEvent.endDate!)}{" "}
                    {formatDate(focusedEvent.endDate!, "XX/XX/XX")}
                  </span>
                </h2>
              ) : (
                <h2>
                  Le{" "}
                  <span>
                    {getDayOfWeek(focusedEvent?.startDate!, "long")}{" "}
                    {formatDate(focusedEvent?.startDate!, "XX/XX/XX")}
                  </span>
                </h2>
              )}
            </div>
            <div className="image">
              {
                <Image
                  src={focusedEvent?.imageUrl!}
                  alt={`image de l'événement du ${getDayOfWeek(
                    focusedEvent?.startDate!,
                    "long"
                  )} ${formatDate(focusedEvent?.startDate!, "XX/XX/XX")}`}
                  fill
                />
              }
            </div>
            <div className="content">{focusedEvent?.content}</div>
          </div>
        </>
      )}
    </>
  );
};

export default Homepage;

// const Modal = ({ isDisplaying }: { isDisplaying: boolean }) => {
//   return (
//     <>
//       <div className="event-modal-backdrop"></div>
//       <div
//         className="event-modal"
//         style={isDisplaying ? { display: "block" } : { display: "none" }}
//       >
//         <button className="close-btn" onClick={toggleDisplayModal}>
//           <i className="fa-solid fa-xmark"></i>
//         </button>
//         <div className="title">
//           {event.endDate ? (
//             <h2>
//               Du{" "}
//               <span>
//                 {getDayOfWeek(event.startDate)} {formatDate(event.startDate, "XX/XX/XX")}
//               </span>{" "}
//               au{" "}
//               <span>
//                 {getDayOfWeek(event.endDate)} {formatDate(event.endDate, "XX/XX/XX")}
//               </span>
//             </h2>
//           ) : (
//             <h2>
//               Le{" "}
//               <span>
//                 {getDayOfWeek(event.startDate, "long")} {formatDate(event.startDate, "XX/XX/XX")}
//               </span>
//             </h2>
//           )}
//         </div>
//         <div className="image">
//           {
//             <Image
//               src={event.imageUrl}
//               alt={`image de l'événement du ${getDayOfWeek(event.startDate, "long")} ${formatDate(
//                 event.startDate,
//                 "XX/XX/XX"
//               )}`}
//               fill
//             />
//           }
//         </div>
//         <div className="content">{event.content}</div>
//       </div>
//     </>
//   );
// };
