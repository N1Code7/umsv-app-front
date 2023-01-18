import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import SortTournamentsBtn from "../components/SortTournamentsBtn";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchRefreshToken, fetchUserRegistrations } from "../../config/fetchFunctions";
import { ITournamentRegistration } from "../../config/interfaces";
import TournamentRegistration from "../components/TournamentRegistration";

interface IUserTournamentsProps {
  deviceDisplay: string;
  setDeviceDisplay: Dispatch<SetStateAction<string>>;
}

const UserTournaments = ({ deviceDisplay, setDeviceDisplay }: IUserTournamentsProps) => {
  const { setAuth } = useContext(AuthenticationContext);
  const [tournamentsRegistrations, setTournamentsRegistrations] = useState([]);
  const [activeSort, setActiveSort] = useState("startDate-ascending");
  const [activeRegistration, setActiveRegistration] = useState({});
  const [isModalActive, setIsModalActive] = useState(false);

  /** Sort registrations depending on the selected sort button */
  const sortRegistrations = (tournamentsRegistrations: Array<ITournamentRegistration>) => {
    return tournamentsRegistrations.sort(
      (a: ITournamentRegistration, b: ITournamentRegistration) => {
        switch (activeSort) {
          case "startDate-ascending":
            return (
              Number(new Date(a.tournament.startDate)) - Number(new Date(b.tournament.startDate))
            );
            break;
          case "startDate-descending":
            return (
              Number(new Date(b.tournament.startDate)) - Number(new Date(a.tournament.startDate))
            );
            break;
          case "name-ascending":
            return a.tournament.name?.localeCompare(b.tournament.name);
            break;
          case "name-descending":
            return b.tournament.name?.localeCompare(a.tournament.name);
            break;
          case "city-ascending":
            return a.tournament.city.localeCompare(b.tournament.city);
            break;
          case "city-descending":
            return b.tournament.city.localeCompare(a.tournament.city);
            break;
          case "requestState-ascending":
            return a.requestState?.localeCompare(b.requestState);
            break;
          case "requestState-descending":
            return b.requestState?.localeCompare(a.requestState);
            break;
          default:
            return (
              Number(new Date(a.tournament.startDate)) - Number(new Date(b.tournament.startDate))
            );
            break;
        }
      }
    );
  };

  /** Refresh token before fetch events and tournaments */
  useEffect(() => {
    fetchRefreshToken()
      .then((res) => {
        setAuth?.((prev) => ({ ...prev, accessToken: res.token }));
        document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
        return res.token;
      })
      .then((res) => fetchUserRegistrations(res))
      .then((res) => setTournamentsRegistrations(res))
      .catch((err) => console.error(err));
  }, [setAuth, activeRegistration]);

  return (
    <main className="user-tournaments user-space">
      <h2>Mes Tournois</h2>

      <div className="tournaments">
        {deviceDisplay === "mobile" ? (
          /** MOBILE */
          <>
            {tournamentsRegistrations
              .sort((a: ITournamentRegistration, b: ITournamentRegistration) => {
                return (
                  Number(new Date(a.tournament.startDate)) -
                  Number(new Date(b.tournament.startDate))
                );
              })
              .map((tournamentRegistration: ITournamentRegistration) => (
                <TournamentRegistration
                  key={tournamentRegistration.id}
                  tournamentRegistration={tournamentRegistration}
                  displayOnMobile
                  setActiveRegistration={setActiveRegistration}
                />
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
                <th>Tableau(x)</th>
                <th>État</th>
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
                <th></th>
                <th>
                  <SortTournamentsBtn
                    activeSort={activeSort}
                    property="requestState"
                    setActiveSort={setActiveSort}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortRegistrations(tournamentsRegistrations).map(
                (tournamentRegistration: ITournamentRegistration) => (
                  <TournamentRegistration
                    key={tournamentRegistration.id}
                    tournamentRegistration={tournamentRegistration}
                    displayOnMobile={false}
                    setActiveRegistration={setActiveRegistration}
                  />
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default UserTournaments;
