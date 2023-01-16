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
import { Navigate, useNavigate } from "react-router-dom";

interface IUserTournamentsProps {
  deviceDisplay: string;
  setDeviceDisplay: Dispatch<SetStateAction<string>>;
}

const UserTournaments = ({ deviceDisplay, setDeviceDisplay }: IUserTournamentsProps) => {
  const navigate = useNavigate();
  const { authToken, setAuthToken, setIsAuthenticated, setUser } =
    useContext(AuthenticationContext);
  // const [deviceDisplay, setDeviceDisplay] = useState("");
  const [tournamentsRegistrations, setTournamentsRegistrations] = useState([]);
  const [activeSort, setActiveSort] = useState("startDate-ascending");
  console.log(deviceDisplay);

  useEffect(() => {
    if (getRefreshTokenFromCookie() && getRefreshTokenFromCookie() !== "") {
      fetchRefreshToken(getRefreshTokenFromCookie())
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(
            "An error occurs when try to refresh user authentication token before fetch user's registrations : " +
              res.statusText
          );
        })
        .then((res) => fetchUserRegistrations(res.token))
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(
            " error occurs when try to fetch user's registrations after refresh token : " +
              res.statusText
          );
        })
        .then((res) => setTournamentsRegistrations(res));
    } else {
      setIsAuthenticated?.(false);
      setAuthToken?.("");
      setUser?.({});
      document.cookie = `refreshToken=;expires=${new Date(-1)};SameSite=strict`;
      navigate("/");
    }

    // if (authToken) {
    //   fetchUserRegistrations(authToken)
    //     .then((res) => {
    //       if (res.ok) {
    //         return res.json();
    //       }
    //       throw new Error(
    //         "An error occurs when try to fetch user's tournaments registrations  : " +
    //           res.statusText
    //       );
    //     })
    //     .then((res) => setTournamentsRegistrations(res));
    // } else if (!authToken && getRefreshTokenFromCookie() && getRefreshTokenFromCookie() !== "") {
    //   fetchRefreshToken(getRefreshTokenFromCookie())
    //     .then((res) => {
    //       if (res.ok) {
    //         return res.json();
    //       }
    //       throw new Error(
    //         "An error occurs when try to refresh user authentication token before fetch user's registrations : " +
    //           res.statusText
    //       );
    //     })
    //     .then((res) => fetchUserRegistrations(res.token))
    //     .then((res) => {
    //       if (res.ok) return res.json();
    //       throw new Error(
    //         " error occurs when try to fetch user's registrations after refresh token : " +
    //           res.statusText
    //       );
    //     })
    //     .then((res) => setTournamentsRegistrations(res));
    // }
  }, [tournamentsRegistrations]);

  // console.log(tournamentsRegistrations);

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
