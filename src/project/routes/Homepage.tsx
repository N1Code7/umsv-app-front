import { useEffect, useState } from "react";
import Event from "../components/Event";
import { IClubEvent, ITournament } from "../../interfaces/interfaces";
import Tournament from "../components/Tournament";
import TournamentsSearch from "../components/TournamentsSearch";
import SortTournamentsBtn from "../components/SortTournamentsBtn";
import { formatDate, getDayOfWeek, getMonthOfYear } from "../../utils/functions/dateFunctions";
import Modal from "../components/Modal";
import Image from "next/image";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useSWR from "swr";

interface IHomepageProps {
  deviceDisplay: string;
}

const Homepage = ({ deviceDisplay }: IHomepageProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedEvent, setFocusedEvent] = useState({} as IClubEvent);
  const [searchByText, setSearchByText] = useState("");
  const [searchByDay, setSearchByDay] = useState("default");
  const [searchByMonth, setSearchByMonth] = useState("default");
  const [searchByYear, setSearchByYear] = useState("default");
  const [activeSort, setActiveSort] = useState("startDate-ascending");

  /** Filter tournaments depending on selected criteria (name/city, day, month, year) */
  const filterTournaments = (tournaments: Array<ITournament>) => {
    return tournaments?.filter((tournament: ITournament) => {
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
  };

  /** Sort tournaments depending on the selected sort button */
  const sortTournaments = (tournaments: Array<ITournament>) => {
    return tournaments?.sort((a: ITournament, b: ITournament) => {
      switch (activeSort) {
        case "startDate-ascending":
          return Number(new Date(a.startDate)) - Number(new Date(b.startDate));
          break;
        case "startDate-descending":
          return Number(new Date(b.startDate)) - Number(new Date(a.startDate));
          break;
        case "name-ascending":
          return a.name?.localeCompare(b.name);
          break;
        case "name-descending":
          return b.name?.localeCompare(a.name);
          break;
        case "city-ascending":
          return a.city.localeCompare(b.city);
          break;
        case "city-descending":
          return b.city.localeCompare(a.city);
          break;
        case "registrationClosingDate-ascending":
          return (
            Number(new Date(a.registrationClosingDate)) -
            Number(new Date(b.registrationClosingDate))
          );
          break;
        case "registrationClosingDate-descending":
          return (
            Number(new Date(b.registrationClosingDate)) -
            Number(new Date(a.registrationClosingDate))
          );
          break;
        case "randomDraw-ascending":
          return Number(new Date(a.randomDraw)) - Number(new Date(b.randomDraw));
          break;
        case "randomDraw-descending":
          return Number(new Date(b.randomDraw)) - Number(new Date(a.randomDraw));
          break;
        case "playersAlreadyRegistered-ascending":
          return a.tournamentRegistrations.length - b.tournamentRegistrations.length;
          break;
        case "playersAlreadyRegistered-descending":
          return b.tournamentRegistrations.length - a.tournamentRegistrations.length;
          break;
        default:
          return Number(new Date(a.startDate)) - Number(new Date(b.startDate));
          break;
      }
    });
  };

  const fetcher = async (url: string) => await axiosPrivate.get(url).then((res) => res.data);
  // .catch((err) => console.log(err));
  const { data: events, mutate: eventsMutate } = useSWR("events", fetcher);
  const { data: tournaments, mutate: tournamentsMutate } = useSWR("tournaments", fetcher);

  useEffect(() => {
    if (!events || !tournaments) {
      eventsMutate();
      tournamentsMutate();
    }
  }, []);

  return (
    <main className="homepage user-space">
      <section className="events-container">
        <h2>Événements à venir</h2>
        <div className="events">
          {!events ? (
            <p>Chargement des événements</p>
          ) : (
            events
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
                  focusedEvent={focusedEvent}
                  isModalActive={isModalActive}
                  setIsModalActive={setIsModalActive}
                  setFocusedEvent={setFocusedEvent}
                />
              ))
          )}
        </div>
        {/* Event Modal */}
        {isModalActive && Object.keys(focusedEvent).length !== 0 && (
          <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
            <div
              className="modal-container_event"
              style={
                isModalActive
                  ? window.innerWidth < 1000
                    ? { display: "block" }
                    : { display: "grid" }
                  : { display: "none" }
              }
            >
              <div className="title">
                {focusedEvent.endDate ? (
                  <h2>
                    Du{" "}
                    <span>
                      {getDayOfWeek(focusedEvent.startDate)}{" "}
                      {formatDate(focusedEvent.startDate, "XX/XX/XX")}
                    </span>{" "}
                    au{" "}
                    <span>
                      {getDayOfWeek(focusedEvent.endDate)}{" "}
                      {formatDate(focusedEvent.endDate, "XX/XX/XX")}
                    </span>
                  </h2>
                ) : (
                  <h2>
                    Le{" "}
                    <span>
                      {getDayOfWeek(focusedEvent.startDate, "long")}{" "}
                      {formatDate(focusedEvent.startDate, "XX/XX/XX")}
                    </span>
                  </h2>
                )}
              </div>
              <div className="image">
                {
                  <Image
                    src={focusedEvent.imageUrl}
                    alt={`image de l'événement du ${getDayOfWeek(
                      focusedEvent.startDate,
                      "long"
                    )} ${formatDate(focusedEvent.startDate, "XX/XX/XX")}`}
                    fill
                    sizes=""
                  />
                }
              </div>
              <div className="content">{focusedEvent.content}</div>
            </div>
          </Modal>
        )}
      </section>

      <section className="tournaments-block">
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
              {!tournaments ? (
                <p>Chargement des tournois</p>
              ) : (
                filterTournaments(tournaments).map((tournament: ITournament) => (
                  <Tournament key={tournament.id} tournament={tournament} displayOnMobile />
                ))
              )}
            </>
          ) : (
            /** DESKTOP */
            <table className="table">
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
                <tr>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="startDate"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="name"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="city"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="registrationClosingDate"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="randomDraw"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="playersAlreadyRegistered"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {!tournaments ? (
                  <tr>
                    <td colSpan={7}>Chargement des tournois</td>
                  </tr>
                ) : (
                  sortTournaments(filterTournaments(tournaments)).map((tournament: ITournament) => (
                    <Tournament
                      key={tournament.id}
                      tournament={tournament}
                      displayOnMobile={false}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
};

export default Homepage;
