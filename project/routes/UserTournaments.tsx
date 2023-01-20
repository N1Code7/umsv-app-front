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
  const registrationName = useRef<HTMLInputElement>(null);
  const registrationCity = useRef<HTMLInputElement>(null);
  const registrationStartDate = useRef<HTMLInputElement>(null);
  const registrationEndDate = useRef<HTMLInputElement>(null);
  const registrationDoublePartnerName = useRef<HTMLInputElement>(null);
  const registrationDoublePartnerClub = useRef<HTMLInputElement>(null);
  const registrationMixedPartnerName = useRef<HTMLInputElement>(null);
  const registrationMixedPartnerClub = useRef<HTMLInputElement>(null);
  const registrationComment = useRef<HTMLTextAreaElement>(null);
  const [tournamentsRegistrations, setTournamentsRegistrations] = useState([]);
  const [activeSort, setActiveSort] = useState("startDate-ascending");
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
                <h2>Modification inscription :</h2>
              </div>
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label htmlFor="tournamentName">Nom du tournoi</label>
                  <input
                    type="text"
                    id="tournamentName"
                    defaultValue={focusedRegistration.tournament.name}
                    ref={registrationName}
                    autoFocus
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="tournamentCity">Ville du tournoi</label>
                  <input
                    type="text"
                    id="tournamentCity"
                    defaultValue={focusedRegistration.tournament.city}
                    ref={registrationCity}
                  />
                </div>
                <div className="form-row">
                  <div className="dates">
                    <label htmlFor="startDate">Du </label>
                    <input
                      type="date"
                      id="startDate"
                      defaultValue={formatDate(
                        focusedRegistration.tournament.startDate,
                        undefined,
                        "XXXX-XX-XX"
                      )}
                      ref={registrationStartDate}
                    />
                    <label htmlFor="endDate"> au </label>
                    <input
                      type="date"
                      id="endDate"
                      defaultValue={formatDate(
                        focusedRegistration.tournament.endDate,
                        undefined,
                        "XXXX-XX-XX"
                      )}
                      ref={registrationEndDate}
                    />
                  </div>
                </div>
                <div className="checkboxes-container">
                  <div className="form-row">
                    <input type="checkbox" name="single" id="single" ref={checkboxSingle} />
                    <label htmlFor="single">Simple</label>
                  </div>

                  <div className="form-row">
                    <input
                      type="checkbox"
                      name="double"
                      id="double"
                      checked={checkboxDouble}
                      onChange={() => setCheckboxDouble((prev) => !prev)}
                    />

                    <label htmlFor="double">Double</label>
                  </div>
                  <div className="form-row">
                    <input
                      type="checkbox"
                      name="mixed"
                      id="mixed"
                      checked={checkboxMixed}
                      onChange={() => setCheckboxMixed((prev) => !prev)}
                    />
                    <label htmlFor="mixed">Mixte</label>
                  </div>
                </div>
                {checkboxDouble && (
                  <div className="form-row">
                    <label htmlFor="doublePartner">Partenaire de Double</label>
                    <div className="partner-container">
                      <input
                        type="text"
                        id="doublePartner"
                        placeholder="NOM / Prénom"
                        defaultValue={focusedRegistration.doublePartnerName}
                        ref={registrationDoublePartnerName}
                      />
                      <input
                        type="text"
                        placeholder="Club"
                        defaultValue={focusedRegistration.doublePartnerClub}
                        ref={registrationDoublePartnerClub}
                      />
                    </div>
                  </div>
                )}
                {checkboxMixed && (
                  <div className="form-row">
                    <label htmlFor="mixedPartner">Partenaire de mixte</label>
                    <div className="partner-container">
                      <input
                        type="text"
                        id="mixedPartner"
                        placeholder="NOM / Prénom"
                        defaultValue={focusedRegistration.mixedPartnerName}
                        ref={registrationMixedPartnerName}
                      />
                      <input
                        type="text"
                        placeholder="Club"
                        defaultValue={focusedRegistration.mixedPartnerClub}
                        ref={registrationMixedPartnerClub}
                      />
                    </div>
                  </div>
                )}
                <div className="form-row">
                  <label htmlFor="comments">Commentaires</label>
                  <textarea
                    id="comments"
                    cols={30}
                    rows={5}
                    ref={registrationComment}
                    defaultValue={focusedRegistration.comment}
                  ></textarea>
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
