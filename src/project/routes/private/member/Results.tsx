import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useSWR from "swr";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import TournamentRegistration from "../../../features/TournamentRegistration/TournamentRegistration";

const Results = () => {
  const axiosPrivate = useAxiosPrivate();
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });

  const { data: tournamentsRegistrations, mutate: registrationsMutate } = useSWR(
    "tournament-registrations",
    async (url: string) => await axiosPrivate.get(url).then((res) => res.data)
  );

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

        <div className="registrations">
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
                .map((registration: ITournamentRegistration) => <>{registration.id + "  "}</>)
              // .map((tournamentRegistration: ITournamentRegistration) => (
              //   <TournamentRegistration
              //     key={tournamentRegistration.id}
              //     tournamentRegistration={tournamentRegistration}
              //     displayOnMobile
              //     setIsModalActive={setIsModalActive}
              //     setFocusedRegistration={setFocusedRegistration}
              //     setRequestMessage={setRequestMessage}
              //   />
              // ))
            )}
          </>
        </div>
      </main>
    </>
  );
};

export default Results;
