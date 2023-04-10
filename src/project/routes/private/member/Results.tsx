import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useSWR from "swr";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import SortTournamentsBtn from "../../../components/SortTournamentsBtn";
import ResultsDisplayedOnMobile from "../../../features/results/ResultsDisplayedOnMobile";
import ResultsDisplayedOnDesktop from "../../../features/results/ResultsDisplayedOnDesktop";
import Modal from "../../../components/Modal";
import UpdateResultForm from "../../../features/results/UpdateResultForm";
import { sleep } from "../../../../utils/globals";

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
    "/tournament-registrations",
    async (url: string) =>
      await sleep(2000)
        .then(() => axiosPrivate.get(url))
        .then((res) => res.data)
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
              Number(new Date(b.tournament?.startDate || b.tournamentStartDate)) -
              Number(new Date(a.tournament?.startDate || a.tournamentStartDate))
            );
            break;
        }
      }
    );
  };

  return (
    <main className="user-results user-space">
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

      <div className="results">
        {deviceDisplay === "mobile" ? (
          /** MOBILE */
          <>
            {!tournamentsRegistrations ? (
              <div>Chargement ...</div>
            ) : (
              tournamentsRegistrations
                .filter(
                  (registration: ITournamentRegistration) =>
                    new Date() >
                      new Date(
                        registration.tournament?.startDate || registration.tournamentStartDate
                      ) && registration.requestState === "validated"
                )
                .sort(
                  (a: ITournamentRegistration, b: ITournamentRegistration) =>
                    Number(new Date(b.tournament?.startDate || b.tournamentStartDate)) -
                    Number(new Date(a.tournament?.startDate || a.tournamentStartDate))
                )
                .map((tournamentRegistration: ITournamentRegistration) => (
                  <ResultsDisplayedOnMobile
                    key={tournamentRegistration.id}
                    tournamentRegistration={tournamentRegistration}
                    setIsModalActive={setIsModalActive}
                    setFocusedRegistration={setFocusedRegistration}
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
                      new Date() >
                        new Date(
                          registration.tournament?.endDate || registration.tournamentEndDate
                        ) && registration.requestState === "validated"
                  )
                ).map((tournamentRegistration: ITournamentRegistration) => (
                  <ResultsDisplayedOnDesktop
                    key={tournamentRegistration.id}
                    tournamentRegistration={tournamentRegistration}
                    setFocusedRegistration={setFocusedRegistration}
                    setIsModalActive={setIsModalActive}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalActive && (
        <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
          <div className="modal-content modal-results">
            <div className="title">
              <h2>Modifier un résultat</h2>
            </div>

            <UpdateResultForm
              focusedRegistration={focusedRegistration}
              setRequestMessage={setRequestMessage}
              setIsModalActive={setIsModalActive}
            />
          </div>
        </Modal>
      )}
    </main>
  );
};

export default Results;
