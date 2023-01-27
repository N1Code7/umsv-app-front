import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import useSWR from "swr";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { ITournamentRegistration } from "../../../config/interfaces";

const AdminHomepage = () => {
  const { user } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();

  const fetcher = async (url: string) =>
    await axiosPrivate
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.error(err));

  const { data: registrations, mutate } = useSWR("admin/tournament-registrations", fetcher);

  useEffect(() => {
    if (!registrations) mutate();
    console.log(registrations);
  }, []);

  return (
    <main className="admin-homepage">
      <h1>Bonjour {user?.firstName}</h1>
      <section>
        <h2>Liste des demandes d&apos;inscription</h2>
        <div className="registrations-container">
          {!registrations ? (
            <p>Chargement des demandes d&apos;inscription </p>
          ) : (
            registrations.map((registration: ITournamentRegistration) => (
              <p key={registration.id}>{registration.user.firstName}</p>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminHomepage;
