import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import { fetchEvents, fetchTournaments, formatDate, getDayOfWeek } from "../../config/functions";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Event from "../components/Event";
import { IClubEvent, ITournament } from "../../config/interfaces";
import { ModalEventContext } from "../../contexts/ModalEventContext";
import Image from "next/image";
import Tournament from "../components/Tournament";

const Homepage = () => {
  const { authToken } = useContext(AuthenticationContext);
  const { focusedEvent, setFocusedEvent, isModalActive, setIsModalActive } =
    useContext(ModalEventContext);
  const [events, setEvents] = useState([]);
  const [display, setDisplay] = useState("");
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const modal = document.body.querySelector(".event-modal");
    const tournaments = document.body.querySelector(".tournaments");
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        if (window.innerWidth < 1000) {
          setDisplay("mobile");
        } else {
          setDisplay("desktop");
        }
      });
    });

    if (modal) observer.observe(modal);
    if (tournaments) observer.observe(tournaments);
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

    fetchTournaments(authToken!)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("An error occurs when try to fetch tournaments list!");
      })
      .then((res) => setTournaments(res));
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

        <div className="tournaments-block">
          <h2>Tournois référencés par le club</h2>
          <div className="tournaments">
            {display === "mobile" ? (
              // MOBILE
              <div></div>
            ) : (
              // DESKTOP
              <table>
                <thead>
                  <tr>
                    <th>Nom du tournoi</th>
                    <th>Ville</th>
                    <th>Date</th>
                    <th>Limite d&apos;inscription</th>
                    <th>Tirage au sort</th>
                    <th>Joueur(s) du club déjà inscrit(s)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments
                    .filter(
                      (tournament: ITournament) =>
                        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10
                    )
                    .sort((a: ITournament, b: ITournament) => {
                      const firstDate = new Date(a.startDate);
                      const secondDate = new Date(b.startDate);
                      return Number(firstDate) - Number(secondDate);
                    })
                    .map((tournament: ITournament) => (
                      <Tournament key={tournament.id} tournament={tournament} />
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {isModalActive && focusedEvent && (
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
