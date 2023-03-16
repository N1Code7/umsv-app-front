import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import useSWR from "swr";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import { sleep } from "../../../../utils/globals";

const AdminHomepage = () => {
  const { user } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();

  const fetcher = async (url: string) =>
    sleep(2000)
      .then(() => axiosPrivate.get(url))
      .then((res) => res.data)
      .catch(
        (err) => {}
        // console.error(err)
      );

  const { data: registrations, mutate } = useSWR("admin/tournament-registrations", fetcher);
  // const { data: results } = useSWR("admin/")

  // useEffect(() => {
  //   if (!registrations) mutate();
  // }, []);

  return (
    <main className="admin-homepage">
      <h1>Bonjour {user?.firstName}</h1>
      <section>
        <h2>Les nouvelles demandes</h2>
        <div className="registrations-container">
          {!registrations ? (
            <p>Chargement des demandes d&apos;inscription </p>
          ) : (
            registrations
              .filter(
                (registration: ITournamentRegistration) => registration?.requestState === "pending"
              )
              .map((registration: ITournamentRegistration) => (
                <p key={registration.id}>
                  {registration.user.firstName} --{" "}
                  {registration.tournament?.city || registration.tournamentCity}
                </p>
              ))
          )}
        </div>
      </section>
      <section className="results-validation">
        <h2>Les nouveaux résultats</h2>
        <div className="results-container">
          {!registrations ? (
            <p>Chargement des demandes d&apos;inscription </p>
          ) : (
            registrations
              .filter(
                (registration: ITournamentRegistration) =>
                  registration.requestState === "validated" &&
                  !registration.result?.areResultsValidated
              )
              .map((registration: ITournamentRegistration) => (
                <p key={registration.id}>
                  {registration.tournament?.city || registration.tournamentCity}
                </p>
              ))
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminHomepage;
