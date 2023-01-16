import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import SortTournamentsBtn from "../components/SortTournamentsBtn";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import {
  fetchRefreshToken,
  fetchUserRegistrations,
  getRefreshTokenFromCookie,
} from "../../config/functions";
import { ITournamentRegistration } from "../../config/interfaces";
import TournamentRegistration from "../components/TournamentRegistration";
import { useNavigate } from "react-router-dom";

interface IUserTournamentsProps {
  deviceDisplay: string;
  setDeviceDisplay: Dispatch<SetStateAction<string>>;
}

const UserTournaments = ({ deviceDisplay, setDeviceDisplay }: IUserTournamentsProps) => {
  const navigate = useNavigate();
  const { authToken, setAuthToken, setIsAuthenticated } = useContext(AuthenticationContext);
  const [tournamentsRegistrations, setTournamentsRegistrations] = useState([]);
  const [activeSort, setActiveSort] = useState("startDate-ascending");
  console.log(deviceDisplay);

  useEffect(() => {
    getRefreshTokenFromCookie() &&
      getRefreshTokenFromCookie() !== "" &&
      fetchRefreshToken()
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
          navigate("/");
          throw new Error("An error occurs when try to refresh the token : " + res.statusText);
        })
        .then((res) => {
          setIsAuthenticated?.(true);
          setAuthToken?.(res.token);
          document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
        });
  }, [authToken]);

  useEffect(() => {
    authToken &&
      fetchUserRegistrations(authToken)
        .then((res) => {
          if (res.ok) return res.json();
          setAuthToken?.("");
          throw new Error(
            res.status +
              " An error occurs when try to fetch user's registrations after refresh token"
          );
        })
        .then((res) => setTournamentsRegistrations(res));
  }, [authToken]);

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
                    property="registrationClosingDate"
                    setActiveSort={setActiveSort}
                  />
                </th>
                {/* <th>
                  <SortTournamentsBtn
                    activeSort={activeSort}
                    property="randomDraw"
                    setActiveSort={setActiveSort}
                  />
                </th> */}
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
