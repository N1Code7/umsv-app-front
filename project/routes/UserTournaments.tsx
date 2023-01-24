import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import SortTournamentsBtn from "../components/SortTournamentsBtn";
import { ITournament, ITournamentRegistration } from "../../config/interfaces";
import TournamentRegistration from "../components/TournamentRegistration";
import Modal from "../components/Modal";
import { formatDate } from "../../config/dateFunctions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useSWR, { useSWRConfig } from "swr";
import { AxiosResponse } from "axios";

interface IUserTournamentsProps {
  deviceDisplay: string;
  setDeviceDisplay: Dispatch<SetStateAction<string>>;
}

const UserTournaments = ({ deviceDisplay, setDeviceDisplay }: IUserTournamentsProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [activeSort, setActiveSort] = useState("startDate-ascending");
  const [isModalActive, setIsModalActive] = useState(false);
  const [focusedRegistration, setFocusedRegistration] = useState({} as ITournamentRegistration);
  const [chooseExistingTournament, setChooseExistingTournament] = useState(true);
  const checkboxSingle = useRef<HTMLInputElement>(null);
  const [checkboxDouble, setCheckboxDouble] = useState(false);
  const [checkboxMixed, setCheckboxMixed] = useState(false);
  const registrationSelectTournament = useRef<HTMLSelectElement>(null);
  const registrationName = useRef<HTMLInputElement>(null);
  const registrationCity = useRef<HTMLInputElement>(null);
  const registrationStartDate = useRef<HTMLInputElement>(null);
  const registrationEndDate = useRef<HTMLInputElement>(null);
  const registrationDoublePartnerName = useRef<HTMLInputElement>(null);
  const registrationDoublePartnerClub = useRef<HTMLInputElement>(null);
  const registrationMixedPartnerName = useRef<HTMLInputElement>(null);
  const registrationMixedPartnerClub = useRef<HTMLInputElement>(null);
  const registrationComment = useRef<HTMLTextAreaElement>(null);
  // const [tournamentsRegistrations, setTournamentsRegistrations] = useState([]);
  // const [tournaments, setTournaments] = useState(Array<ITournament>);

  const getFetcher = async (url: string) => await axiosPrivate.get(url).then((res) => res.data);
  const { data: tournaments, error: tournamentsError } = useSWR("tournaments", getFetcher);
  const { data: tournamentsRegistrations, error: tournamentsRegistrationsError } = useSWR(
    "tournament-registrations",
    getFetcher
  );
  const { mutate: tournamentsRegistrationsMutate } = useSWRConfig();

  /** Sort registrations depending on the selected sort button */
  const sortRegistrations = (tournamentsRegistrations: Array<ITournamentRegistration>) => {
    return tournamentsRegistrations.sort(
      (a: ITournamentRegistration, b: ITournamentRegistration) => {
        const tournamentNameA = a.tournament?.name || a.tournamentName || "";
        const tournamentNameB = b.tournament?.name || b.tournamentName || "";

        switch (activeSort) {
          case "startDate-ascending":
            if (a.tournament && b.tournament) {
              return (
                Number(new Date(a.tournament.startDate)) - Number(new Date(b.tournament.startDate))
              );
            } else {
              return (
                Number(new Date(a.tournamentStartDate)) - Number(new Date(b.tournamentStartDate))
              );
            }
            break;
          case "startDate-descending":
            if (a.tournament && b.tournament) {
              return (
                Number(new Date(b.tournament.startDate)) - Number(new Date(a.tournament.startDate))
              );
            } else {
              return (
                Number(new Date(b.tournamentStartDate)) - Number(new Date(a.tournamentStartDate))
              );
            }
            break;
          case "name-ascending":
            return tournamentNameA.localeCompare(tournamentNameB);
            break;
          case "name-descending":
            return tournamentNameB.localeCompare(tournamentNameA);
            break;
          case "city-ascending":
            if (a.tournament !== null && b.tournament !== null) {
              return a.tournament.city.localeCompare(b.tournament.city);
            } else {
              return a.tournamentCity.localeCompare(b.tournamentCity);
            }
            break;
          case "city-descending":
            if (a.tournament !== null && b.tournament !== null) {
              return b.tournament.city.localeCompare(a.tournament.city);
            } else {
              return a.tournamentCity.localeCompare(b.tournamentCity);
            }
            break;
          case "requestState-ascending":
            return a.requestState?.localeCompare(b.requestState);
            break;
          case "requestState-descending":
            return b.requestState?.localeCompare(a.requestState);
            break;
          default:
            if (a.tournament !== null && b.tournament !== null) {
              return (
                Number(new Date(a.tournament.startDate)) - Number(new Date(b.tournament.startDate))
              );
            } else {
              return (
                Number(new Date(a.tournamentStartDate)) - Number(new Date(b.tournamentStartDate))
              );
            }
            break;
        }
      }
    );
  };

  const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const controller = new AbortController();
    setIsModalActive(false);
    axiosPrivate
      .patch(
        "tournament-registration/" + focusedRegistration.id,
        {
          tournamentName:
            registrationName.current?.value || focusedRegistration.tournament?.name || null,
          tournamentCity:
            registrationCity.current?.value || focusedRegistration.tournament?.city || null,
          tournamentStartDate: registrationStartDate.current
            ? new Date(Number(registrationStartDate.current?.value)).toISOString()
            : focusedRegistration.tournament
            ? new Date(focusedRegistration.tournament?.startDate).toISOString()
            : null,
          tournamentEndDate: registrationEndDate.current
            ? new Date(Number(registrationEndDate.current?.value)).toISOString()
            : focusedRegistration.tournament
            ? new Date(focusedRegistration?.tournament.endDate).toISOString()
            : null,
          participationSingle: checkboxSingle.current?.checked,
          participationDouble: checkboxDouble,
          participationMixed: checkboxMixed,
          doublePartnerName: registrationDoublePartnerName.current?.value || null,
          doublePartnerClub: registrationDoublePartnerClub.current?.value || null,
          mixedPartnerName: registrationMixedPartnerName.current?.value || null,
          mixedPartnerClub: registrationMixedPartnerClub.current?.value || null,
          comment: registrationComment.current?.value || null,
        },
        { signal: controller.signal }
      )
      .then((res: unknown) => {
        setFocusedRegistration(res as ITournamentRegistration);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    tournamentsRegistrationsMutate("tournament-registrations");
  }, [focusedRegistration, tournamentsRegistrationsMutate]);

  /** Fetch events and tournaments */
  // useEffect(() => {
  //   let ignore = false;
  //   const controller = new AbortController();

  //   const getTournaments = async () =>
  //     (await axiosPrivate.get("tournaments", { signal: controller.signal })).data;

  //   const getRegistrations = async () =>
  //     (await axiosPrivate.get("tournament-registrations", { signal: controller.signal })).data;

  //   Promise.all([getTournaments(), getRegistrations()])
  //     .then(([tour, reg]) => {
  //       if (!ignore) {
  //         setTournamentsRegistrations(reg);
  //         setTournaments(tour);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       if (controller.signal.aborted) {
  //         console.log("The user aborted the request");
  //       } else {
  //         console.error("The request failed");
  //       }
  //     });

  //   return () => {
  //     ignore = true;
  //     controller.abort();
  //   };
  // }, [focusedRegistration]);

  return (
    <main className="user-tournaments user-space">
      <h2>Mes Tournois</h2>

      <div className="registrations">
        {deviceDisplay === "mobile" ? (
          /** MOBILE */
          <>
            {!tournamentsRegistrations ? (
              <div>Chargement ...</div>
            ) : (
              tournamentsRegistrations
                .sort((a: ITournamentRegistration, b: ITournamentRegistration) => {
                  if (a.tournament !== null && b.tournament !== null) {
                    return (
                      Number(new Date(a.tournament.startDate)) -
                      Number(new Date(b.tournament.startDate))
                    );
                  } else {
                    return (
                      Number(new Date(a.tournamentStartDate)) -
                      Number(new Date(b.tournamentStartDate))
                    );
                  }
                })
                .map((tournamentRegistration: ITournamentRegistration) => (
                  <TournamentRegistration
                    key={tournamentRegistration.id}
                    tournamentRegistration={tournamentRegistration}
                    displayOnMobile
                    setIsModalActive={setIsModalActive}
                    setFocusedRegistration={setFocusedRegistration}
                    setChooseExistingTournament={setChooseExistingTournament}
                  />
                ))
            )}
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
              {!tournamentsRegistrations ? (
                <tr>
                  <td>Chargement ...</td>
                </tr>
              ) : (
                sortRegistrations(tournamentsRegistrations).map(
                  (tournamentRegistration: ITournamentRegistration) => (
                    <TournamentRegistration
                      key={tournamentRegistration.id}
                      tournamentRegistration={tournamentRegistration}
                      setFocusedRegistration={setFocusedRegistration}
                      displayOnMobile={false}
                      setIsModalActive={setIsModalActive}
                      setChooseExistingTournament={setChooseExistingTournament}
                    />
                  )
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
              <form className="form" onSubmit={handleModalSubmit}>
                <div className="form-row choose-tournament-identifier">
                  <span>Tournoi existant</span>
                  <div
                    className={
                      chooseExistingTournament ? "switch-container" : "switch-container active"
                    }
                    onClick={() => setChooseExistingTournament(!chooseExistingTournament)}
                  >
                    <div className="switch-circle"></div>
                  </div>
                  <span>Nouveau tournoi</span>
                </div>

                {chooseExistingTournament ? (
                  <div className="form-row">
                    <label htmlFor="selectTournament">Sélectionner un tournoi existant</label>
                    <select
                      id="selectTournament"
                      defaultValue={focusedRegistration.tournament?.id || "---"}
                      ref={registrationSelectTournament}
                      autoFocus
                    >
                      <option value="null">---</option>
                      {tournaments
                        .sort(
                          (a: ITournament, b: ITournament) =>
                            Number(new Date(a.startDate)) - Number(new Date(b.startDate))
                        )
                        .map((tournament: ITournament) => (
                          <option key={tournament.id} value={tournament.id}>
                            {tournament.name?.slice(0, 20) + "..." || "ℹ️"} - {tournament.city} -{" "}
                            {tournament.endDate
                              ? formatDate(
                                  tournament.startDate,
                                  tournament.endDate,
                                  "XX & XX xxx XXXX"
                                )
                              : formatDate(tournament.startDate, undefined, "XX xxx XXXX")}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="form-row">
                      <label htmlFor="tournamentName">Nom du tournoi</label>
                      <input
                        type="text"
                        id="tournamentName"
                        // list="tournamentOptions"
                        autoFocus
                        ref={registrationName}
                        defaultValue={focusedRegistration?.tournamentName || ""}
                      />
                      {/* <datalist id="tournamentOptions">
                        {tournaments
                          .filter(
                            (tournament: ITournament) =>
                              new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10
                          )
                          .map((tournament: ITournament) => (
                            <option key={tournament.id} value={tournament.name}>
                              {tournament.name + " - " + tournament.city}
                            </option>
                          ))}
                      </datalist> */}
                    </div>
                    <div className="form-row">
                      <label htmlFor="tournamentCity">Ville du tournoi</label>
                      <input
                        type="text"
                        id="tournamentCity"
                        ref={registrationCity}
                        defaultValue={focusedRegistration?.tournamentCity || ""}
                      />
                    </div>
                    <div className="form-row">
                      <div className="dates">
                        <label htmlFor="startDate">Du </label>
                        <input
                          type="date"
                          id="startDate"
                          ref={registrationStartDate}
                          defaultValue={focusedRegistration?.tournamentStartDate || ""}
                        />
                        <label htmlFor="endDate"> au </label>
                        <input
                          type="date"
                          id="endDate"
                          ref={registrationEndDate}
                          defaultValue={focusedRegistration?.tournamentEndDate || ""}
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* <div className="separating-line just-line"></div> */}
                <div className="checkboxes-container">
                  <div className="form-row">
                    <input
                      type="checkbox"
                      name="single"
                      id="single"
                      ref={checkboxSingle}
                      defaultChecked={focusedRegistration?.participationSingle || false}
                    />
                    <label htmlFor="single">Simple</label>
                  </div>

                  <div className="form-row">
                    <input
                      type="checkbox"
                      name="double"
                      id="double"
                      checked={focusedRegistration?.participationDouble || checkboxDouble}
                      onChange={() => setCheckboxDouble((prev) => !prev)}
                    />

                    <label htmlFor="double">Double</label>
                  </div>
                  <div className="form-row">
                    <input
                      type="checkbox"
                      name="mixed"
                      id="mixed"
                      checked={focusedRegistration?.participationMixed || checkboxMixed}
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
                        defaultValue={focusedRegistration?.doublePartnerName || ""}
                        ref={registrationDoublePartnerName}
                      />
                      <input
                        type="text"
                        placeholder="Club"
                        defaultValue={focusedRegistration?.doublePartnerClub || ""}
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
                        defaultValue={focusedRegistration?.mixedPartnerName || ""}
                        ref={registrationMixedPartnerName}
                      />
                      <input
                        type="text"
                        placeholder="Club"
                        defaultValue={focusedRegistration?.mixedPartnerClub || ""}
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
                    defaultValue={focusedRegistration?.comment || ""}
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
