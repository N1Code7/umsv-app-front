import { ChangeEvent, EventHandler, MouseEvent, useContext, useEffect, useState } from "react";
import {
  fetchEvents,
  fetchTournaments,
  formatDate,
  getDayOfWeek,
  getMonthOfYear,
} from "../../config/functions";
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
  const [displaySearch, setDisplaySearch] = useState(false);
  const [searchByText, setSearchByText] = useState("");
  const [searchByDay, setSearchByDay] = useState("default");
  const [searchByMonth, setSearchByMonth] = useState("default");
  const [searchByYear, setSearchByYear] = useState("default");
  const daysNumber = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];
  const monthsNumber = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchByText("");
    setSearchByDay("default");
    setSearchByMonth("default");
    setSearchByYear("default");
  };

  /** Adapt the component return to window's width => RESPONSIVE */
  useEffect(() => {
    const modal = document.body.querySelector(".event-modal");
    const tournamentsDiv = document.body.querySelector(".tournaments");
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
    if (tournamentsDiv) observer.observe(tournamentsDiv);
  }, [display]);

  const handleCloseModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedEvent?.({});
    setIsModalActive?.(false);
  };

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
    <>
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
          <div className={displaySearch ? "search-container active" : "search-container"}>
            <button id="searchMobileBtn" onClick={() => setDisplaySearch(!displaySearch)}>
              Rechercher un tournoi 🔎
            </button>
            <h3>Rechercher un tournoi 🔎</h3>
            <form>
              <div className="form-control">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="nom ou ville"
                    value={searchByText}
                    defaultValue=""
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchByText(e.target.value)}
                  />
                </div>
                <span>ou</span>
                <div className="form-row">
                  {/* Day search */}
                  <select
                    id="daySelected"
                    defaultValue="default"
                    value={searchByDay}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSearchByDay(e.target.value)}
                  >
                    <option value="default">--</option>
                    {daysNumber.map((day: string, index: number) => (
                      <option key={index} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {/* Month search */}
                  <select
                    id="monthSelected"
                    // defaultValue="default"
                    value={searchByMonth}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSearchByMonth(e.target.value)
                    }
                  >
                    <option value="default">------</option>
                    {monthsNumber.map((month: string, index: number) => (
                      <option key={index} value={month.toLowerCase()}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {/* Year search */}
                  <select
                    id="yearSelected"
                    // defaultValue="default"
                    value={searchByYear}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSearchByYear(e.target.value)
                    }
                  >
                    <option value="default">----</option>
                    {[new Date().getFullYear(), new Date().getFullYear() + 1].map(
                      (year: number, index: number) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <button className="btn btn-secondary btn-small" id="resetBtn" onClick={handleReset}>
                Réinitialiser les filtres
              </button>
            </form>
          </div>
          {/* )} */}
          <div className="tournaments">
            {display === "mobile" ? (
              // MOBILE
              <>
                {tournaments
                  .filter((tournament: ITournament) => {
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
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth &&
                          new Date(tournament.startDate).getFullYear() === Number(searchByYear))
                      );
                    } else if (
                      searchByText.length >= 3 &&
                      (searchByDay !== "default" ||
                        searchByMonth !== "default" ||
                        searchByYear !== "default")
                    ) {
                      /** Search by name/city and one of date parameter */
                      return (
                        ((new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
                          tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
                          tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
                        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
                        (new Date(tournament.startDate).getDate() === Number(searchByDay) ||
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth ||
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
                        getMonthOfYear(
                          String(new Date(tournament.startDate)),
                          "long"
                        ).toLowerCase() === searchByMonth
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
                        getMonthOfYear(
                          String(new Date(tournament.startDate)),
                          "long"
                        ).toLowerCase() === searchByMonth &&
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
                        getMonthOfYear(
                          String(new Date(tournament.startDate)),
                          "long"
                        ).toLowerCase() === searchByMonth &&
                        new Date(tournament.startDate).getFullYear() === Number(searchByYear)
                      );
                    } else if (searchByDay !== "default" && searchByMonth !== "default") {
                      /** Search only by day AND month */
                      return (
                        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
                        new Date(tournament.startDate).getDate() === Number(searchByDay) &&
                        getMonthOfYear(
                          String(new Date(tournament.startDate)),
                          "long"
                        ).toLowerCase() === searchByMonth
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
                        getMonthOfYear(
                          String(new Date(tournament.startDate)),
                          "long"
                        ).toLowerCase() === searchByMonth &&
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
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth ||
                          new Date(tournament.startDate).getFullYear() === Number(searchByYear))
                      );
                    } else {
                      return new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10;
                    }
                  })
                  .sort((a: ITournament, b: ITournament) => {
                    const firstDate = new Date(a.startDate);
                    const secondDate = new Date(b.startDate);
                    return Number(firstDate) - Number(secondDate);
                  })
                  .map((tournament: ITournament) => (
                    <Tournament key={tournament.id} tournament={tournament} onMobile />
                  ))}
              </>
            ) : (
              // DESKTOP
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
                  {tournaments
                    .filter((tournament: ITournament) => {
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
                            new Date(tournament.randomDraw).getTime() - new Date().getTime() >
                              -10 &&
                            new Date(tournament.startDate).getDate() === Number(searchByDay) &&
                            getMonthOfYear(
                              String(new Date(tournament.startDate)),
                              "long"
                            ).toLowerCase() === searchByMonth &&
                            new Date(tournament.startDate).getFullYear() === Number(searchByYear))
                        );
                      } else if (
                        searchByText.length >= 3 &&
                        (searchByDay !== "default" ||
                          searchByMonth !== "default" ||
                          searchByYear !== "default")
                      ) {
                        /** Search by name/city and one of date parameter */
                        return (
                          ((new Date(tournament.randomDraw).getTime() - new Date().getTime() >
                            -10 &&
                            tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
                            tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
                          new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
                          (new Date(tournament.startDate).getDate() === Number(searchByDay) ||
                            getMonthOfYear(
                              String(new Date(tournament.startDate)),
                              "long"
                            ).toLowerCase() === searchByMonth ||
                            new Date(tournament.startDate).getFullYear() === Number(searchByYear))
                        );
                      } else if (
                        searchByText.length >= 3 &&
                        searchByDay !== "default" &&
                        searchByMonth !== "default"
                      ) {
                        /** Search by name/city, day AND month */
                        return (
                          ((new Date(tournament.randomDraw).getTime() - new Date().getTime() >
                            -10 &&
                            tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
                            tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
                          new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
                          new Date(tournament.startDate).getDate() === Number(searchByDay) &&
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth
                        );
                      } else if (
                        searchByText.length >= 3 &&
                        searchByDay !== "default" &&
                        searchByYear !== "default"
                      ) {
                        /** Search by name/city, day AND year */
                        return (
                          ((new Date(tournament.randomDraw).getTime() - new Date().getTime() >
                            -10 &&
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
                          ((new Date(tournament.randomDraw).getTime() - new Date().getTime() >
                            -10 &&
                            tournament.city?.toLowerCase().includes(searchByText.toLowerCase())) ||
                            tournament.name?.toLowerCase().includes(searchByText.toLowerCase())) &&
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth &&
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
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth &&
                          new Date(tournament.startDate).getFullYear() === Number(searchByYear)
                        );
                      } else if (searchByDay !== "default" && searchByMonth !== "default") {
                        /** Search only by day AND month */
                        return (
                          new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 &&
                          new Date(tournament.startDate).getDate() === Number(searchByDay) &&
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth
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
                          getMonthOfYear(
                            String(new Date(tournament.startDate)),
                            "long"
                          ).toLowerCase() === searchByMonth &&
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
                              tournament.name
                                ?.toLowerCase()
                                .includes(searchByText.toLowerCase()))) ||
                            new Date(tournament.startDate).getDate() === Number(searchByDay) ||
                            getMonthOfYear(
                              String(new Date(tournament.startDate)),
                              "long"
                            ).toLowerCase() === searchByMonth ||
                            new Date(tournament.startDate).getFullYear() === Number(searchByYear))
                        );
                      } else {
                        return (
                          new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10
                        );
                      }
                    })
                    .sort((a: ITournament, b: ITournament) => {
                      const firstDate = new Date(a.startDate);
                      const secondDate = new Date(b.startDate);
                      return Number(firstDate) - Number(secondDate);
                    })
                    .map((tournament: ITournament) => (
                      <Tournament key={tournament.id} tournament={tournament} onMobile={false} />
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
