import { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";
import { fetchEvents } from "../../config/functions";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Event from "../components/Event";
import { IClubEvent } from "../../config/interfaces";

const Homepage = () => {
  const { authToken } = useContext(AuthenticationContext);
  const [events, setEvents] = useState([]);

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
          <h2>Tournois à venir</h2>
          <div className="tournaments-block"></div>
        </div>
      </main>
    </>
  );
};

export default Homepage;
