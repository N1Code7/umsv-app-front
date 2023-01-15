import { useContext, useEffect, useState } from "react";
import SortTournamentsBtn from "../components/SortTournamentsBtn";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchUserRegistrations } from "../../config/functions";
import { ITournament, ITournamentRegistration } from "../../config/interfaces";
import TournamentRegistration from "../components/TournamentRegistration";

const UserTournaments = () => {
  const { authToken } = useContext(AuthenticationContext);
  const [deviceDisplay, setDeviceDisplay] = useState("");
  const [tournamentsRegistrations, setTournamentsRegistrations] = useState([]);
  const [activeSort, setActiveSort] = useState("startDate-ascending");

  useEffect(() => {
    if (authToken) {
      fetchUserRegistrations(authToken)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(
            "An error occurs when try to fetch user's tournaments registrations  : " +
              res.statusText
          );
        })
        .then((res) => setTournamentsRegistrations(res));
    }
  }, [authToken]);

  console.log(tournamentsRegistrations);

  return (
    <main>
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
                <th>Limite d&apos;inscription</th>
                <th>Tirage au sort</th>
                <th>Simple</th>
                <th>Double</th>
                <th>Mixte</th>
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
                    displayOnMobile={false}
                  />
                ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default UserTournaments;
