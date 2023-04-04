import { MouseEvent, useContext, useRef, useState } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import useSWR from "swr";
import { sleep } from "../../../../utils/globals";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { IUser } from "../../../../interfaces/interfaces";
import Modal from "../../../components/Modal";
import UserForm from "../../../features/users/UserForm";
import UserBand from "../../../features/users/UserBand";

interface IProps {}

const AdminUsersHandle = ({}: IProps) => {
  const { user } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedUser, setFocusedUser] = useState({} as IUser);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });
  const [patchMethod, setPatchMethod] = useState(false);
  const pendingSectionRef = useRef<HTMLDivElement>(null);
  const [isPendingSectionOpened, setIsPendingSectionOpened] = useState(true);
  const [isActiveSectionOpened, setIsActiveSectionOpened] = useState(false);
  const [isInactiveSectionOpened, setIsInactiveSectionOpened] = useState(false);
  // const [isSearchActive, setIsSearchActive] = useState(false);

  const { data: users, isLoading: usersLoading } = useSWR("/admin/users", async (url: string) =>
    sleep(2000)
      .then(() => axiosPrivate.get(url))
      .then((res) => res.data)
      .catch((err) => console.error(err))
  );

  const handleNewUser = (e: MouseEvent<HTMLButtonElement>) => {
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
      case "active":
        setIsActiveSectionOpened((prev) => !prev);
        break;
      case "inactive":
        setIsInactiveSectionOpened((prev) => !prev);
        break;
      default:
        return;
    }
  };

  const displayUserCard = (filter: string) =>
    users
      .filter((user: IUser) => user.state === filter)
      .sort(
        (a: IUser, b: IUser) =>
          Number(new Date(b?.updatedAt || b?.createdAt)) -
          Number(new Date(a.updatedAt || a.createdAt))
      )
      .map((user: IUser) => (
        <UserBand
          key={user.id}
          user={user}
          setFocusedUser={setFocusedUser}
          setIsModalActive={setIsModalActive}
          setRequestMessage={setRequestMessage}
          setPatchMethod={setPatchMethod}
        />
      ));

  const displayUsersNumber = (filter: string) =>
    users.filter((user: IUser) => user.state === filter).length;

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
      <h2>Gestion des utilisateurs</h2>

      <div className="blocks">
        <div className="global-actions">
          <button className="btn btn-primary" id="addRegistration" onClick={handleNewUser}>
            <span>
              <i className="fa-solid fa-plus"></i>
            </span>
            Créer un utilisateur
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

        <div className="pending-block">
          <div className="section-header">
            <h3>
              Utilisateurs en attente ({usersLoading ? "..." : displayUsersNumber("pending")})
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
            {usersLoading ? (
              <p>Chargement des demandes d&apos;inscription</p>
            ) : !users ? (
              <p>Aucune demande d&apos;inscription en attente</p>
            ) : (
              displayUserCard("pending")
            )}
          </div>
        </div>

        <div className="active-block">
          <div className="section-header">
            <h3>Utilisateurs traités ({usersLoading ? "..." : displayUsersNumber("active")})</h3>
            <button onClick={handleOpeningSection}>
              <i
                className={`fa-solid fa-chevron-${isActiveSectionOpened ? "up" : "down"}`}
                data-section="active"
              ></i>
            </button>
          </div>
          <div
            className="section-body"
            style={
              isActiveSectionOpened
                ? undefined
                : { maxHeight: 0, opacity: 0, zIndex: "-5", position: "absolute" }
            }
          >
            {usersLoading ? (
              <p>Chargement des demandes d&apos;inscription</p>
            ) : !users ? (
              <p>Aucune demande d&apos;inscription en attente</p>
            ) : (
              displayUserCard("active")
            )}
          </div>
        </div>

        <div className="inactive-block">
          <div className="section-header">
            <h3>Utilisateurs annulés ({usersLoading ? "..." : displayUsersNumber("inactive")})</h3>
            <button onClick={handleOpeningSection}>
              <i
                className={`fa-solid fa-chevron-${isInactiveSectionOpened ? "up" : "down"}`}
                data-section="inactive"
              ></i>
            </button>
          </div>
          <div
            className="section-body"
            style={
              isInactiveSectionOpened
                ? undefined
                : { maxHeight: 0, opacity: 0, zIndex: "-5", position: "absolute" }
            }
          >
            {usersLoading ? (
              <p>Chargement des demandes d&apos;inscription</p>
            ) : !users ? (
              <p>Aucune demande d&apos;inscirption en attente</p>
            ) : (
              displayUserCard("inactive")
            )}
          </div>
        </div>
      </div>

      {isModalActive && (
        <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
          <div className="modal-content modal-registration">
            <div className="title">
              <h2>Modification de l&apos;utilisateur :</h2>
            </div>

            <UserForm
              patchMethod={patchMethod}
              setRequestMessage={setRequestMessage}
              focusedUser={focusedUser}
              isModalActive={isModalActive}
              setIsModalActive={setIsModalActive}
            />
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AdminUsersHandle;
