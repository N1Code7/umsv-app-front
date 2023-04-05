import { MouseEvent, useContext, useRef, useState } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import useSWR from "swr";
import { sleep } from "../../../../utils/globals";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";
import RegistrationBand from "../../../features/tournamentsRegistrations/RegistrationBand";
import Modal from "../../../components/Modal";
import AdminRegistrationForm from "../../../features/tournamentsRegistrations/AdminRegistrationForm";

interface IProps {}

const AdminRegistrationsDemands = ({}: IProps) => {
  const { user } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedRegistration, setFocusedRegistration] = useState({} as ITournamentRegistration);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });
  const [patchMethod, setPatchMethod] = useState(false);
  const pendingSectionRef = useRef<HTMLDivElement>(null);
  const [isPendingSectionOpened, setIsPendingSectionOpened] = useState(true);
  const [isValidatedSectionOpened, setIsValidatedSectionOpened] = useState(false);
  const [isCancelledSectionOpened, setIsCancelledSectionOpened] = useState(false);
  // const [isSearchActive, setIsSearchActive] = useState(false);

  const fetcher = async (url: string) =>
    sleep(2000)
      .then(() => axiosPrivate.get(url))
      .then((res) => res.data)
      .catch((err) => console.error(err));
  const { data: registrations, isLoading: registrationsLoading } = useSWR(
    "/admin/tournament-registrations",
    fetcher
  );
  const { data: tournaments, isLoading: tournamentsLoading } = useSWR("/tournaments", fetcher);
  const { data: users, isLoading: usersLoading } = useSWR("/admin/users", fetcher);

  const handleAddRegistrationClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPatchMethod?.(false);
    setIsModalActive?.(true);
  };

  const handleOpeningSection = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    switch ((e.target as HTMLButtonElement).dataset.section) {
      case "pending":
        setIsPendingSectionOpened((prev) => !prev);
        break;
      case "validated":
        setIsValidatedSectionOpened((prev) => !prev);
        break;
      case "cancelled":
        setIsCancelledSectionOpened((prev) => !prev);
        break;
      default:
        return;
    }
  };

  const displayRegistrationCard = (filter: string) =>
    registrations
      ?.filter((registration: ITournamentRegistration) => registration.requestState === filter)
      .sort(
        (a: ITournamentRegistration, b: ITournamentRegistration) =>
          Number(new Date(b.updatedAt || b.createdAt)) -
          Number(new Date(a.updatedAt || a.createdAt))
      )
      .map((registration: ITournamentRegistration) => (
        <RegistrationBand
          key={registration.id}
          tournamentRegistration={registration}
          setFocusedRegistration={setFocusedRegistration}
          setIsModalActive={setIsModalActive}
          setRequestMessage={setRequestMessage}
          setPatchMethod={setPatchMethod}
        />
      ));

  const displayRegistrationsNumber = (filter: string) =>
    registrations?.filter(
      (registration: ITournamentRegistration) => registration.requestState === filter
    ).length;

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

      <div className="registrations-blocks">
        <div className="global-actions">
          <button
            className="btn btn-primary"
            id="addRegistration"
            onClick={handleAddRegistrationClick}
          >
            <span>
              <i className="fa-solid fa-plus"></i>
            </span>
            Créer une inscription
          </button>

          {/* <input
            type={isSearchActive ? "button" : "search"}
            className="btn btn-primary"
            id="searchRegistration"
            value={"rechercher"}
            onClick={() => setIsSearchActive((prev) => !prev)}
            // onClick={(e:MouseEvent<HTMLInputElement>) => {e.preventDefault()}}
          /> */}
          {/* <input type="search" name="searchRegistration" placeholder="Test" />
          <input type="month" name="" id="" /> */}
        </div>

        <div className="pending-registrations">
          <div className="section-header">
            <h3>
              Demandes en attente (
              {registrationsLoading ? "..." : displayRegistrationsNumber("pending")})
            </h3>
            <button onClick={handleOpeningSection}>
              <i
                className={`fa-solid fa-chevron-${isPendingSectionOpened ? "up" : "down"}`}
                data-section="pending"
              ></i>
            </button>
          </div>
          <div
            className="section-body"
            style={
              isPendingSectionOpened
                ? undefined
                : { maxHeight: 0, opacity: 0, zIndex: "-5", position: "absolute" }
            }
            ref={pendingSectionRef}
          >
            {registrationsLoading ? (
              <p>Chargement des demandes d&apos;inscription</p>
            ) : !registrations ? (
              <p>Aucune demande d&apos;inscription en attente</p>
            ) : (
              displayRegistrationCard("pending")
            )}
          </div>
        </div>

        <div className="validated-registrations">
          <div className="section-header">
            <h3>
              Demandes traitées (
              {registrationsLoading ? "..." : displayRegistrationsNumber("validated")})
            </h3>
            <button onClick={handleOpeningSection}>
              <i
                className={`fa-solid fa-chevron-${isValidatedSectionOpened ? "up" : "down"}`}
                data-section="validated"
              ></i>
            </button>
          </div>
          <div
            className="section-body"
            style={
              isValidatedSectionOpened
                ? undefined
                : { maxHeight: 0, opacity: 0, zIndex: "-5", position: "absolute" }
            }
          >
            {registrationsLoading ? (
              <p>Chargement des demandes d&apos;inscription</p>
            ) : !registrations ? (
              <p>Aucune demande d&apos;inscription en attente</p>
            ) : (
              displayRegistrationCard("validated")
            )}
          </div>
        </div>

        <div className="cancelled-registrations">
          <div className="section-header">
            <h3>
              Demandes annulées (
              {registrationsLoading ? "..." : displayRegistrationsNumber("cancelled")})
            </h3>
            <button onClick={handleOpeningSection}>
              <i
                className={`fa-solid fa-chevron-${isCancelledSectionOpened ? "up" : "down"}`}
                data-section="cancelled"
              ></i>
            </button>
          </div>
          <div
            className="section-body"
            style={
              isCancelledSectionOpened
                ? undefined
                : { maxHeight: 0, opacity: 0, zIndex: "-5", position: "absolute" }
            }
          >
            {registrationsLoading ? (
              <p>Chargement des demandes d&apos;inscription</p>
            ) : !registrations ? (
              <p>Aucune demande d&apos;inscirption en attente</p>
            ) : (
              displayRegistrationCard("cancelled")
            )}
          </div>
        </div>
      </div>

      {isModalActive && (
        <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
          <div className="modal-content modal-registration">
            <div className="title">
              <h2>Modification de l&apos;inscription :</h2>
            </div>

            <AdminRegistrationForm
              patchMethod={patchMethod}
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
