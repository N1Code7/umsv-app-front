import { useContext, useState } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import useSWR from "swr";
import { sleep } from "../../../../utils/globals";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import RegistrationBand from "../../../features/displayTournamentsRegistrations/components/RegistrationBand";
import RegistrationForm from "../../../features/displayTournamentsRegistrations/components/RegistrationForm";
import Modal from "../../../components/Modal";

interface IProps {}

const AdminRegistrationsDemands = ({}: IProps) => {
  const { user } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedRegistration, setFocusedRegistration] = useState({} as ITournamentRegistration);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });

  const { data: registrations, isLoading: registrationsLoading } = useSWR(
    "admin/tournament-registrations",
    async (url: string) =>
      sleep(2000)
        .then(() => axiosPrivate.get(url))
        .then((res) => res.data)
        .catch((err) => console.error(err))
  );

  const displayRegistrationCard = (filter: string) =>
    registrations
      .filter((registration: ITournamentRegistration) => registration.requestState === filter)
      .map((registration: ITournamentRegistration) => (
        <RegistrationBand
          key={registration.id}
          tournamentRegistration={registration}
          setFocusedRegistration={setFocusedRegistration}
          setIsModalActive={setIsModalActive}
          setRequestMessage={setRequestMessage}
        />
      ));

  return (
    <main className="admin-space">
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

      <h1>Bonjour {user?.firstName}</h1>
      <h2>Les demandes d&apos;inscription</h2>

      <div className="registrations-columns">
        <div className="pending-registrations">
          <h3>Demandes en attente</h3>
          {registrationsLoading ? (
            <p>Chargement des demandes d&pos;inscription</p>
          ) : !registrations ? (
            <p>Aucune demande d&apos;inscirption en attente</p>
          ) : (
            displayRegistrationCard("pending")
          )}
        </div>

        <div className="validated-registrations">
          <h3>Demandes traitées</h3>
          {registrationsLoading ? (
            <p>Chargement des demandes d&pos;inscription</p>
          ) : !registrations ? (
            <p>Aucune demande d&apos;inscirption en attente</p>
          ) : (
            displayRegistrationCard("validated")
          )}
        </div>

        <div className="cancelled-registrations">
          <h3>Demandes annulées</h3>
          {registrationsLoading ? (
            <p>Chargement des demandes d&pos;inscription</p>
          ) : !registrations ? (
            <p>Aucune demande d&apos;inscirption en attente</p>
          ) : (
            displayRegistrationCard("cancelled")
          )}
        </div>
      </div>

      {isModalActive && (
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
    </main>
  );
};

export default AdminRegistrationsDemands;
