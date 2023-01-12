import { useContext, useEffect, useState } from "react";
import { fetchEvents, fetchTournaments, getMonthOfYear } from "../../config/functions";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import Event from "../components/Event";
import { IClubEvent, ITournament } from "../../config/interfaces";
import Tournament from "../components/Tournament";
import TournamentsSearch from "../components/TournamentsSearch";
import EventModal from "../components/EventModal";

const Homepage = () => {
  const { authToken } = useContext(AuthenticationContext);
  const [events, setEvents] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedEvent, setFocusedEvent] = useState({} as IClubEvent);
  const [deviceDisplay, setDeviceDisplay] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [searchByText, setSearchByText] = useState("");
  const [searchByDay, setSearchByDay] = useState("default");
  const [searchByMonth, setSearchByMonth] = useState("default");
  const [searchByYear, setSearchByYear] = useState("default");

  /** Array which contains the filtered tournaments */
  const filteredTournaments = tournaments.filter((tournament: ITournament) => {
    if (
      /** Search by name/city and full date */
      searchByText.length >= 3 &&
      searchByDay !== "default" &&
      searchByMonth !== "default" &&
      searchByYear !== "default"
    ) {
      return (
        (new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
          tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
        (tournament.name?.toLowerCase().includes(searchByText.toLowerCase()) &&
          new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
          new Date(tournament.startDate).getDate() === Number(searchByDay) &&
          getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
            searchByMonth &&
          new Date(tournament.startDate).getFullYear() === Number(searchByYear))
      );
    } else if (
      searchByText.length >= 3 &&
      (searchByDay !== "default" || searchByMonth !== "default" || searchByYear !== "default")
    ) {
      /** Search by name/city and one of date parameter */
      return (
        ((new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
          tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
          tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        (new Date(tournament.startDate).getDate() === Number(searchByDay) ||
          getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
            searchByMonth ||
          new Date(tournament.startDate).getFullYear() === Number(searchByYear))
      );
    } else if (
      searchByText.length >= 3 &&
      searchByDay !== "default" &&
      searchByMonth !== "default"
    ) {
      /** Search by name/city, day AND month */
      return (
        ((new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
          tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
          tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        new Date(tournament.startDate).getDate() === Number(searchByDay) &&
        getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
          searchByMonth
      );
    } else if (
      searchByText.length >= 3 &&
      searchByDay !== "default" &&
      searchByYear !== "default"
    ) {
      /** Search by name/city, day AND year */
      return (
        ((new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
          tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
          tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        new Date(tournament.startDate).getDate() === Number(searchByDay) &&
        new Date(tournament.startDate).getFullYear() === Number(searchByYear)
      );
    } else if (
      searchByText.length >= 3 &&
      searchByDay !== "default" &&
      searchByMonth !== "default"
    ) {
      /** Search by name/city, year AND month */
      return (
        ((new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
          tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
          tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
        getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
          searchByMonth &&
        new Date(tournament.startDate).getFullYear() === Number(searchByYear)
      );
    } else if (
      searchByDay !== "default" &&
      searchByMonth !== "default" &&
      searchByYear !== "default"
    ) {
      /** Search only by full date */
      return (
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        new Date(tournament.startDate).getDate() === Number(searchByDay) &&
        getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
          searchByMonth &&
        new Date(tournament.startDate).getFullYear() === Number(searchByYear)
      );
    } else if (searchByDay !== "default" && searchByMonth !== "default") {
      /** Search only by day AND month */
      return (
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        new Date(tournament.startDate).getDate() === Number(searchByDay) &&
        getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
          searchByMonth
      );
    } else if (searchByDay !== "default" && searchByYear !== "default") {
      /** Search only by day AND year */
      return (
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        new Date(tournament.startDate).getDate() === Number(searchByDay) &&
        new Date(tournament.startDate).getFullYear() === Number(searchByYear)
      );
    } else if (searchByYear !== "default" && searchByMonth !== "default") {
      /** Search only by year AND month */
      return (
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
          searchByMonth &&
        new Date(tournament.startDate).getFullYear() === Number(searchByYear)
      );
    } else if (
      searchByText.length >= 3 ||
      searchByDay !== "default" ||
      searchByMonth !== "default" ||
      searchByYear !== "default"
    ) {
      /** Search by city/name OR day OR month OR year */
      return (
        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
        ((searchByText.length >= 3 &&
          (tournament.city?.toLowerCase().includes(searchByText.toLowerCase()) ||
            tournament.name?.toLowerCase().includes(searchByText.toLowerCase()))) ||
          new Date(tournament.startDate).getDate() === Number(searchByDay) ||
          getMonthOfYear(String(new Date(tournament.startDate)), "long").toLowerCase() ===
            searchByMonth ||
          new Date(tournament.startDate).getFullYear() === Number(searchByYear))
      );
    } else {
      return new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10;
    }
  });

  /** Adapt the component return to window's width => RESPONSIVE */
  useEffect(() => {
    const modal = document.body.querySelector(".event-modal");
    const tournamentsDiv = document.body.querySelector(".tournaments");
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        if (window.innerWidth < 1000) {
          setDeviceDisplay("mobile");
        } else {
          setDeviceDisplay("desktop");
        }
      });
    });

    if (modal) observer.observe(modal);
    if (tournamentsDiv) observer.observe(tournamentsDiv);
  }, [deviceDisplay]);

  //** Fetches functions for events and tournaments */
  useEffect(() => {
    if (authToken) {
      fetchEvents(authToken)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("An error occurs when try to fetch events : " + res.statusText);
        })
        .then((res) => setEvents(res))
        .catch((err) => console.error(err));

      fetchTournaments(authToken!)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("An error occurs when try to fetch tournaments list : " + res.statusText);
        })
        .then((res) => setTournaments(res));
    }
  }, [authToken]);

  return (
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
              <Event
                key={event.id}
                event={event}
                isModalActive={isModalActive}
                setIsModalActive={setIsModalActive}
                setFocusedEvent={setFocusedEvent}
              />
            ))}
        </div>
        {isModalActive && (focusedEvent as IClubEvent) && (
          <EventModal
            focusedEvent={focusedEvent}
            setFocusedEvent={setFocusedEvent}
            isModalActive={isModalActive}
            setIsModalActive={setIsModalActive}
          />
        )}
      </div>

      <div className="tournaments-block">
        <h2>Tournois référencés par le club</h2>
        <TournamentsSearch
          searchByText={searchByText}
          setSearchByText={setSearchByText}
          searchByDay={searchByDay}
          setSearchByDay={setSearchByDay}
          searchByMonth={searchByMonth}
          setSearchByMonth={setSearchByMonth}
          searchByYear={searchByYear}
          setSearchByYear={setSearchByYear}
        />

        <div className="tournaments">
          {deviceDisplay === "mobile" ? (
            /** MOBILE */
            <>
              {filteredTournaments
                .sort((a: ITournament, b: ITournament) => {
                  const firstDate = new Date(a.startDate);
                  const secondDate = new Date(b.startDate);
                  return Number(firstDate) - Number(secondDate);
                })
                .map((tournament: ITournament) => (
                  <Tournament key={tournament.id} tournament={tournament} displayOnMobile />
                ))}
            </>
          ) : (
            /** DESKTOP */
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Nom du tournoi</th>
                  <th>Ville</th>
                  <th>Limite d&apos;inscription</th>
                  <th>Tirage au sort</th>
                  <th>Déjà inscrit(s)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTournaments
                  .sort((a: ITournament, b: ITournament) => {
                    const firstDate = new Date(a.startDate);
                    const secondDate = new Date(b.startDate);
                    return Number(firstDate) - Number(secondDate);
                  })
                  .map((tournament: ITournament) => (
                    <Tournament
                      key={tournament.id}
                      tournament={tournament}
                      displayOnMobile={false}
                    />
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

export default Homepage;
