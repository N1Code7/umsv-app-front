import { useContext } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import useSWR from "swr";
import { sleep } from "../../../../utils/globals";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";

interface IProps {}

const AdminRegistrationsDemands = ({}: IProps) => {
  const { user } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();

  const { data: registrations, isLoading: registrationsLoading } = useSWR(
    "admin/tournament-registrations",
    async (url: string) =>
      sleep(2000)
        .then(() => axiosPrivate.get(url))
        .then((res) => res.data)
        .catch((err) => console.error(err))
  );

  return (
    <main className="admin-space">
      <h1>Bonjour {user?.firstName}</h1>
      <h2>Les demandes d&apos;inscription</h2>

      <div className="registrations-container">
        {registrationsLoading ? (
          <p>Chargement des demandes d&pos;inscription</p>
        ) : !registrations ? (
          <p>Aucune demande d&apos;inscirption en attente</p>
        ) : (
          registrations.map((registration: ITournamentRegistration) => (
            <p key={registration.id}> {registration.id}</p>
          ))
        )}
      </div>
    </main>
  );
};

export default AdminRegistrationsDemands;
