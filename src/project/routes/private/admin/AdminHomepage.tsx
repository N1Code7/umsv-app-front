import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import useSWR from "swr";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ITournamentRegistration, IUser } from "../../../../interfaces/interfaces";
import { sleep } from "../../../../utils/globals";
import { formatDate } from "../../../../utils/dateFunctions";

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

  const { data: registrations, isLoading: registrationsLoading } = useSWR(
    "admin/tournament-registrations",
    fetcher
  );
  const { data: users, isLoading: usersLoading } = useSWR("admin/users", fetcher);

  return (
    <main className="admin-space">
      <h1>Bonjour {user?.firstName}</h1>

      <div className="sections-container">
        {/* Registrations list */}
        <section className="registrations-validation">
          <h2>Demandes d&apos;inscription à traiter</h2>
          <div className="registrations-container">
            {registrationsLoading ? (
              <p>Chargement des demandes d&apos;inscription</p>
            ) : !registrations ? (
              <p>Chargement des demandes d&apos;inscription </p>
            ) : (
              registrations
                .sort(
                  (a: ITournamentRegistration, b: ITournamentRegistration) =>
                    Number(new Date(b.updatedAt || b.createdAt)) -
                    Number(new Date(a.updatedAt || a.createdAt))
                )
                .filter(
                  (registration: ITournamentRegistration) =>
                    registration?.requestState === "pending"
                )
                .slice(0, 5)
                .map((registration: ITournamentRegistration) => (
                  <div className="card" key={registration.id}>
                    <i className="fa-solid fa-user"></i>
                    <div className="identity">
                      {registration.user.firstName} {registration.user.lastName}
                    </div>
                    <i className="fa-solid fa-city"></i>
                    <div className="tournament-city">
                      {registration.tournament?.city || registration.tournamentCity}
                    </div>
                    <i className="fa-solid fa-calendar-days"></i>
                    <div className="tournament-date">
                      {registration.tournament?.endDate || registration.tournamentEndDate
                        ? formatDate(
                            String(
                              registration.tournament?.startDate || registration.tournamentStartDate
                            ),
                            String(
                              registration.tournament?.endDate || registration.tournamentEndDate
                            ),
                            "XX & XX xxx XXXX"
                          )
                        : formatDate(
                            String(
                              registration.tournament?.startDate || registration.tournamentStartDate
                            ),
                            undefined,
                            "XX xxx XXXX"
                          )}
                    </div>
                  </div>
                ))
            )}
            {registrations?.filter(
              (registration: ITournamentRegistration) => registration?.requestState === "pending"
            ).length > 5 && <button className="card">Voir plus</button>}
          </div>
        </section>

        {/* Results list */}
        <section className="results-validation">
          <h2>Résultats à valider</h2>
          <div className="results-container">
            {registrationsLoading ? (
              <p>Chargement des demandes d&apos;inscription </p>
            ) : !registrations ? (
              <p>Aucune nouvelle demande d&apos;inscription</p>
            ) : (
              registrations
                .filter(
                  (registration: ITournamentRegistration) =>
                    registration.requestState === "validated" &&
                    Number(
                      new Date(registration.tournament?.endDate || registration.tournamentEndDate)
                    ) < Number(new Date()) &&
                    !registration.result?.areResultsValidated
                )
                .slice(0, 5)
                .map((registration: ITournamentRegistration) => (
                  <div key={registration.id} className="card">
                    <i className="fa-solid fa-user"></i>
                    <div className="identity">
                      {registration.user?.firstName} {registration.user?.lastName}
                    </div>
                    <i className="fa-solid fa-city"></i>
                    <div className="tournament-city">
                      {registration.tournament?.city || registration.tournamentCity}
                    </div>
                  </div>
                ))
            )}
            {registrations?.filter(
              (registration: ITournamentRegistration) =>
                registration.requestState === "validated" &&
                Number(
                  new Date(registration.tournament?.endDate || registration.tournamentEndDate)
                ) < Number(new Date()) &&
                !registration.result?.areResultsValidated
            ).length > 5 && <button className="card">Voir plus</button>}
          </div>
        </section>

        {/* Users list */}
        <section className="users-validation">
          <h2>Utilisateurs à authentifier</h2>
          <div className="users-container">
            {usersLoading ? (
              <p>Chargement des nouveaux utilisateurs</p>
            ) : !users ? (
              <p>Aucun nouveau utilisateur</p>
            ) : (
              users
                .filter((user: IUser) => !user.validatedAccount)
                .map((user: IUser) => (
                  <div key={user.id} className="card">
                    <i className="fa-solid fa-user"></i>
                    <div className="identity">{user.firstName}</div>
                    <i className="fa-solid fa-envelope"></i>
                    <div className="user-email">{user.email}</div>
                  </div>
                ))
            )}
            {users?.filter((user: IUser) => !user.validatedAccount).length > 5 && (
              <button className="card">Voir plus</button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminHomepage;
