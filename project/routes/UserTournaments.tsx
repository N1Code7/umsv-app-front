import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SortTournamentsBtn from "../components/SortTournamentsBtn";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchRefreshToken, fetchUserRegistrations } from "../../config/fetchFunctions";
import { ITournamentRegistration } from "../../config/interfaces";
import TournamentRegistration from "../components/TournamentRegistration";
import Modal from "../components/Modal";
import { formatDate } from "../../config/dateFunctions";

interface IUserTournamentsProps {
  deviceDisplay: string;
  setDeviceDisplay: Dispatch<SetStateAction<string>>;
}

const UserTournaments = ({ deviceDisplay, setDeviceDisplay }: IUserTournamentsProps) => {
  const { setAuth } = useContext(AuthenticationContext);
  const checkboxSingle = useRef<HTMLInputElement>(null);
  const [tournamentsRegistrations, setTournamentsRegistrations] = useState([]);
  const [activeSort, setActiveSort] = useState("startDate-ascending");
  const [activeRegistration, setActiveRegistration] = useState({});
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedRegistration, setFocusedRegistration] = useState({} as ITournamentRegistration);
  const [checkboxDouble, setCheckboxDouble] = useState(false);
  const [checkboxMixed, setCheckboxMixed] = useState(false);

  /** Sort registrations depending on the selected sort button */
  const sortRegistrations = (tournamentsRegistrations: Array<ITournamentRegistration>) => {
    return tournamentsRegistrations.sort(
      (a: ITournamentRegistration, b: ITournamentRegistration) => {
        switch (activeSort) {
          case "startDate-ascending":
            return (
              Number(new Date(a.tournament.startDate)) - Number(new Date(b.tournament.startDate))
            );
            break;
          case "startDate-descending":
            return (
              Number(new Date(b.tournament.startDate)) - Number(new Date(a.tournament.startDate))
            );
            break;
          case "name-ascending":
            return a.tournament.name?.localeCompare(b.tournament.name);
            break;
          case "name-descending":
            return b.tournament.name?.localeCompare(a.tournament.name);
            break;
          case "city-ascending":
            return a.tournament.city.localeCompare(b.tournament.city);
            break;
          case "city-descending":
            return b.tournament.city.localeCompare(a.tournament.city);
            break;
          case "requestState-ascending":
            return a.requestState?.localeCompare(b.requestState);
            break;
          case "requestState-descending":
            return b.requestState?.localeCompare(a.requestState);
            break;
          default:
            return (
              Number(new Date(a.tournament.startDate)) - Number(new Date(b.tournament.startDate))
            );
            break;
        }
      }
    );
  };

  const handleSubmit = () => {};

  /** Refresh token before fetch events and tournaments */
  useEffect(() => {
    fetchRefreshToken()
      .then((res) => {
        setAuth?.((prev) => ({ ...prev, accessToken: res.token }));
        document.cookie = `refreshToken=${res.refreshToken};max-age=2592000;SameSite=strict;secure;path=/`;
        return res.token;
      })
      .then((res) => fetchUserRegistrations(res))
      .then((res) => {
        setTournamentsRegistrations(res);
      })
      .catch((err) => console.error(err));
  }, [setAuth, focusedRegistration]);

  useEffect(() => {
    setFocusedRegistration({} as ITournamentRegistration);
  }, []);

  return (
    <main className="user-tournaments user-space">
      <h2>Mes Tournois</h2>

      <div className="registrations">
        {deviceDisplay === "mobile" ? (
          /** MOBILE */
          <>
            {tournamentsRegistrations
              .sort((a: ITournamentRegistration, b: ITournamentRegistration) => {
                return (
                  Number(new Date(a.tournament.startDate)) -
                  Number(new Date(b.tournament.startDate))
                );
              })
              .map((tournamentRegistration: ITournamentRegistration) => (
                <TournamentRegistration
                  key={tournamentRegistration.id}
                  tournamentRegistration={tournamentRegistration}
                  displayOnMobile
                  setActiveRegistration={setActiveRegistration}
                  setIsModalActive={setIsModalActive}
                  setFocusedRegistration={setFocusedRegistration}
                />
              ))}
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
              {sortRegistrations(tournamentsRegistrations).map(
                (tournamentRegistration: ITournamentRegistration) => (
                  <TournamentRegistration
                    key={tournamentRegistration.id}
                    tournamentRegistration={tournamentRegistration}
                    displayOnMobile={false}
                    setActiveRegistration={setActiveRegistration}
                    setIsModalActive={setIsModalActive}
                    setFocusedRegistration={setFocusedRegistration}
                  />
                )
              )}
            </tbody>
          </table>
        )}
        {isModalActive && Object.keys(focusedRegistration).length !== 0 && (
          <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
            <div className="modal-container_registration">
              <div className="title">
                <h2>Modification inscription</h2>
              </div>
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label htmlFor="tournamentName">Nom du tournoi</label>
                  <input
                    type="text"
                    id="tournamentName"
                    value={focusedRegistration.tournament.name}
                    disabled
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="tournamentCity">Ville du tournoi</label>
                  <input
                    type="text"
                    id="tournamentCity"
                    value={focusedRegistration.tournament.city}
                    disabled
                  />
                </div>
                <div className="form-row">
                  Du{" "}
                  <span>{formatDate(focusedRegistration.tournament.startDate, "XX xxx XXXX")}</span>
                  Au{" "}
                  <span>{formatDate(focusedRegistration.tournament.endDate, "XX xxx XXXX")}</span>
                </div>
                <div className="form-row">
                  <label htmlFor="single">Simple</label>
                  <input type="checkbox" name="single" id="single" ref={checkboxSingle} />
                  <label htmlFor="double">Double</label>
                  <input
                    type="checkbox"
                    name="double"
                    id="double"
                    checked={checkboxDouble}
                    onChange={() => setCheckboxDouble((prev) => !prev)}
                  />
                  <label htmlFor="mixte">Mixte</label>
                  <input
                    type="checkbox"
                    name="mixed"
                    id="mixed"
                    checked={checkboxMixed}
                    onChange={() => setCheckboxMixed((prev) => !prev)}
                  />
                </div>
                {checkboxDouble && (
                  <div className="form-row">
                    <label htmlFor="doublePartner">Partenaire de Double</label>
                    <input type="text" id="doublePartner" placeholder="NOM / Prénom" />
                    <input type="text" placeholder="Club" />
                  </div>
                )}
                {checkboxMixed && (
                  <div className="form-row">
                    <label htmlFor="mixedPartner">Partenaire de mixte</label>
                    <input type="text" id="mixedPartner" placeholder="NOM / Prénom" />
                    <input type="text" placeholder="Club" />
                  </div>
                )}
                <div className="form-row">
                  <label htmlFor="comments">Commentaires</label>
                  <textarea id="comments" cols={30} rows={10}>
                    {focusedRegistration.comment}
                  </textarea>
                </div>
                <input type="submit" value="Modifier mon inscription" className="btn btn-primary" />
              </form>
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
};

export default UserTournaments;
