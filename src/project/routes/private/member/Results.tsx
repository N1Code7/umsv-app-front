import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useSWR from "swr";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import TournamentResults from "../../../features/displayResults/TournamentResults";
import SortTournamentsBtn from "../../../components/SortTournamentsBtn";

interface IProps {
  deviceDisplay: string;
}

const Results = ({ deviceDisplay }: IProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [activeSort, setActiveSort] = useState("startDate-ascending");
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedRegistration, setFocusedRegistration] = useState({} as ITournamentRegistration);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });

  const { data: tournamentsRegistrations, mutate: registrationsMutate } = useSWR(
    "tournament-registrations",
    async (url: string) => await axiosPrivate.get(url).then((res) => res.data)
  );

  /** Sort registrations depending on the selected sort button */
  const sortRegistrations = (tournamentsRegistrations: Array<ITournamentRegistration>) => {
    return tournamentsRegistrations.sort(
      (a: ITournamentRegistration, b: ITournamentRegistration) => {
        switch (activeSort) {
          case "startDate-ascending":
            return (
              Number(new Date(a.tournament?.startDate || a.tournamentStartDate)) -
              Number(new Date(b.tournament?.startDate || b.tournamentStartDate))
            );
            break;
          case "startDate-descending":
            return (
              Number(new Date(b.tournament?.startDate || b.tournamentStartDate)) -
              Number(new Date(a.tournament?.startDate || a.tournamentStartDate))
            );
            break;
          case "name-ascending":
            return (a.tournament?.name || a.tournamentName || "").localeCompare(
              b.tournament?.name || b.tournamentName || ""
            );
            break;
          case "name-descending":
            return (b.tournament?.name || b.tournamentName || "").localeCompare(
              a.tournament?.name || a.tournamentName || ""
            );
            break;
          case "city-ascending":
            return (a.tournament?.city || a.tournamentCity).localeCompare(
              b.tournament?.city || b.tournamentCity
            );
            break;
          case "city-descending":
            return (b.tournament?.city || b.tournamentCity).localeCompare(
              a.tournament?.city || a.tournamentCity
            );
            break;
          default:
            return (
              Number(new Date(a.tournament?.startDate || a.tournamentStartDate)) -
              Number(new Date(b.tournament?.startDate || b.tournamentStartDate))
            );
            break;
        }
      }
    );
  };

  return (
    <>
      <main className="user-space">
        {requestMessage.success !== "" && (
          <div className="notification-message">
            <p className="success">{requestMessage.success}</p>
          </div>
        )}
        {requestMessage.error !== "" && (
          <div className="notification-message">
            <p className="error">{requestMessage.error}</p>
          </div>
        )}

        <h2>Mes résultats</h2>

        <div className="registrations results">
          {deviceDisplay === "mobile" ? (
            /** MOBILE */
            <>
              {!tournamentsRegistrations ? (
                <div>Chargement ...</div>
              ) : (
                tournamentsRegistrations
                  .filter(
                    (registration: ITournamentRegistration) =>
                      new Date() > new Date(registration.tournament.endDate) &&
                      registration.requestState === "validated"
                  )
                  .sort(
                    (a: ITournamentRegistration, b: ITournamentRegistration) =>
                      Number(new Date(a.tournament?.startDate || a.tournamentStartDate)) -
                      Number(new Date(b.tournament?.startDate || b.tournamentStartDate))
                  )
                  .map((tournamentRegistration: ITournamentRegistration) => (
                    <TournamentResults
                      key={tournamentRegistration.id}
                      tournamentRegistration={tournamentRegistration}
                      deviceDisplay="mobile"
                      setIsModalActive={setIsModalActive}
                      setFocusedRegistration={setFocusedRegistration}
                      setRequestMessage={setRequestMessage}
                    />
                  ))
              )}
            </>
          ) : (
            /** DESKTOP */
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Nom du tournoi</th>
                  <th>Ville</th>
                  <th>Simple</th>
                  <th>Double</th>
                  <th>Mixte</th>
                  <th>Validation</th>
                  <th>Action</th>
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
                  {/* <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="single"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="double"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="double"
                      setActiveSort={setActiveSort}
                    />
                  </th>
                  <th>
                    <SortTournamentsBtn
                      activeSort={activeSort}
                      property="validation"
                      setActiveSort={setActiveSort}
                    />
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {!tournamentsRegistrations ? (
                  <tr>
                    <td>Chargement ...</td>
                  </tr>
                ) : (
                  sortRegistrations(
                    tournamentsRegistrations.filter(
                      (registration: ITournamentRegistration) =>
                        registration.tournament?.endDate &&
                        new Date() > new Date(registration.tournament.endDate) &&
                        registration.requestState === "validated"
                    )
                  ).map((tournamentRegistration: ITournamentRegistration) => (
                    <TournamentResults
                      key={tournamentsRegistrations.id}
                      tournamentRegistration={tournamentRegistration}
                      setFocusedRegistration={setFocusedRegistration}
                      deviceDisplay="desktop"
                      setIsModalActive={setIsModalActive}
                      setRequestMessage={setRequestMessage}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
};

export default Results;
