import { useState } from "react";
import SortTournamentsBtn from "../../../components/SortTournamentsBtn";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import Modal from "../../../components/Modal";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useSWR from "swr";
import { sleep } from "../../../../utils/globals";
import TournamentRegistration from "../../../features/member/displayTournamentsRegistrations/TournamentRegistration";
import RegistrationForm from "../../../features/member/displayTournamentsRegistrations/components/RegistrationForm";

interface IUserTournamentsProps {
  deviceDisplay: string;
}

const UserTournamentsRegistrations = ({ deviceDisplay }: IUserTournamentsProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [activeSort, setActiveSort] = useState("startDate-ascending");
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedRegistration, setFocusedRegistration] = useState({} as ITournamentRegistration);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });

  const { data: tournamentsRegistrations } = useSWR(
    "tournament-registrations",
    async (url: string) =>
      sleep(2000)
        .then(() => axiosPrivate.get(url))
        .then((res) => res.data)
  );

  /** Sort registrations depending on the selected sort button */
  const sortRegistrations = (tournamentsRegistrations: Array<ITournamentRegistration>) => {
    return tournamentsRegistrations.sort(
      (a: ITournamentRegistration, b: ITournamentRegistration) => {
        const tournamentNameA = a.tournament?.name || a.tournamentName || "";
        const tournamentNameB = b.tournament?.name || b.tournamentName || "";

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
            return tournamentNameA.localeCompare(tournamentNameB);
            break;
          case "name-descending":
            return tournamentNameB.localeCompare(tournamentNameA);
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
          case "requestState-ascending":
            return a.requestState?.localeCompare(b.requestState);
            break;
          case "requestState-descending":
            return b.requestState?.localeCompare(a.requestState);
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
    <main className="user-tournaments-registrations user-space">
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

      <h2>Mes Tournois</h2>

      <div className="registrations">
        {deviceDisplay === "mobile" ? (
          /** MOBILE */
          <>
            {!tournamentsRegistrations ? (
              <div>Chargement ...</div>
            ) : (
              tournamentsRegistrations
                .sort(
                  (a: ITournamentRegistration, b: ITournamentRegistration) =>
                    Number(new Date(a.tournament?.startDate || a.tournamentStartDate)) -
                    Number(new Date(b.tournament?.startDate || b.tournamentStartDate))
                )
                .map((tournamentRegistration: ITournamentRegistration) => (
                  <TournamentRegistration
                    key={tournamentRegistration.id}
                    tournamentRegistration={tournamentRegistration}
                    displayOnMobile
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
              {!tournamentsRegistrations ? (
                <tr>
                  <td>Chargement ...</td>
                </tr>
              ) : (
                sortRegistrations(tournamentsRegistrations).map(
                  (tournamentRegistration: ITournamentRegistration) => (
                    <TournamentRegistration
                      key={tournamentRegistration.id}
                      tournamentRegistration={tournamentRegistration}
                      setFocusedRegistration={setFocusedRegistration}
                      displayOnMobile={false}
                      setIsModalActive={setIsModalActive}
                      setRequestMessage={setRequestMessage}
                    />
                  )
                )
              )}
            </tbody>
          </table>
        )}

        {isModalActive && Object.keys(focusedRegistration).length !== 0 && (
          <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
            <div className="modal-content modal-registration">
              <div className="title">
                <h2>Modification inscription :</h2>
              </div>

              <RegistrationForm
                patchMethod={true}
                setRequestMessage={setRequestMessage}
                focusedRegistration={focusedRegistration}
                isModalActive={isModalActive}
                setIsModalActive={setIsModalActive}
              />
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
};

export default UserTournamentsRegistrations;
