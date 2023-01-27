import { FormEvent, useRef, useState } from "react";
import { formatDate } from "../../config/dateFunctions";
import { ITournament } from "../../config/interfaces";
import useSWR from "swr";
import Switch from "../components/Switch";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const NewTournamentRegistration = () => {
  const checkboxSingle = useRef<HTMLInputElement>(null);
  const [checkboxDouble, setCheckboxDouble] = useState(false);
  const [checkboxMixed, setCheckboxMixed] = useState(false);
  const [chooseExistingTournament, setChooseExistingTournament] = useState(true);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  /** Fetch tournaments */
  const axiosPrivate = useAxiosPrivate();
  const fetcher = async (url: string) =>
    await axiosPrivate
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.error(err));
  const { data: tournaments, mutate: tournamentsMutate } = useSWR("tournaments", fetcher);
  /**  */

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const controller = new AbortController();
    console.log(registrationSelectTournament.current?.value);

    await axiosPrivate
      .post(
        "tournament-registration",
        {
          tournamentName: registrationSelectTournament.current?.value
            ? tournaments
                .filter(
                  (tournament: ITournament) =>
                    tournament.id == Number(registrationSelectTournament.current?.value)
                )
                .map((tournament: ITournament) => tournament.name)[0]
            : registrationName.current
            ? registrationName.current?.value
            : null,
          tournamentCity: registrationSelectTournament.current?.value
            ? tournaments
                .filter(
                  (tournament: ITournament) =>
                    tournament.id == Number(registrationSelectTournament.current?.value)
                )
                .map((tournament: ITournament) => tournament.city)[0]
            : registrationCity.current
            ? registrationCity.current?.value
            : null,
          tournamentStartDate: registrationSelectTournament.current?.value
            ? tournaments
                .filter(
                  (tournament: ITournament) =>
                    tournament.id == Number(registrationSelectTournament.current?.value)
                )
                .map((tournament: ITournament) => tournament.startDate)[0]
            : registrationStartDate.current
            ? new Date(registrationStartDate.current?.value).toISOString()
            : null,
          tournamentEndDate: registrationSelectTournament.current?.value
            ? tournaments
                .filter(
                  (tournament: ITournament) =>
                    tournament.id == Number(registrationSelectTournament.current?.value)
                )
                .map((tournament: ITournament) => tournament.endDate)[0]
            : registrationEndDate.current
            ? new Date(registrationEndDate.current?.value).toISOString()
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
      .then((res: unknown) =>
        setConfirmMessage("Votre demande d'inscription a bien été créée ! 👌")
      )
      .catch((err: unknown) => {
        console.error(err);
        setErrorMessage(
          "Une erreur est survenue lors de l'envoi de votre demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur. "
        );
      });
  };

  return (
    <main className="new-registration user-space">
      {confirmMessage && (
        <div className="notification-message">
          <p className="success">{confirmMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="notification-message">
          <p className="error">{errorMessage}</p>
        </div>
      )}
      <h2>Demande d&apos;inscription à un tournoi</h2>

      <form className="form" onSubmit={handleSubmitForm}>
        <div className="form-row choose-tournament-identifier">
          <span onClick={() => setChooseExistingTournament(false)} style={{ cursor: "pointer" }}>
            Tournoi existant
          </span>
          <Switch
            customName="toggle-form"
            isActive={chooseExistingTournament}
            setIsActive={setChooseExistingTournament}
          />
          <span onClick={() => setChooseExistingTournament(true)} style={{ cursor: "pointer" }}>
            Nouveau tournoi
          </span>
        </div>

        {!chooseExistingTournament ? (
          <div className="form-row">
            <label htmlFor="selectTournament">Sélectionner un tournoi existant</label>
            <select id="selectTournament" ref={registrationSelectTournament} autoFocus>
              <option value="null">---</option>
              {!tournaments
                ? "Chargement..."
                : tournaments
                    .filter(
                      (tournament: ITournament) =>
                        new Date(tournament.registrationClosingDate) > new Date()
                    )
                    .sort(
                      (a: ITournament, b: ITournament) =>
                        Number(new Date(a.startDate)) - Number(new Date(b.startDate))
                    )
                    .map((tournament: ITournament) => (
                      <option key={tournament.id} value={tournament.id}>
                        {tournament.name?.slice(0, 20) + "..." || "ℹ️"} - {tournament.city} -{" "}
                        {tournament.endDate
                          ? formatDate(tournament.startDate, tournament.endDate, "XX & XX xxx XXXX")
                          : formatDate(tournament.startDate, undefined, "XX xxx XXXX")}
                      </option>
                    ))}
            </select>
          </div>
        ) : (
          <>
            <div className="form-row">
              <label htmlFor="tournamentName">Nom du tournoi</label>
              <input type="text" id="tournamentName" autoFocus ref={registrationName} />
            </div>
            <div className="form-row">
              <label htmlFor="tournamentCity">Ville du tournoi</label>
              <input type="text" id="tournamentCity" ref={registrationCity} />
            </div>
            <div className="form-row">
              <div className="dates">
                <label htmlFor="startDate">Du </label>
                <input type="date" id="startDate" ref={registrationStartDate} />
                <label htmlFor="endDate"> au </label>
                <input type="date" id="endDate" ref={registrationEndDate} />
              </div>
            </div>
          </>
        )}
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
              onChange={() => setCheckboxDouble((prev) => !prev)}
            />

            <label htmlFor="double">Double</label>
          </div>
          <div className="form-row">
            <input
              type="checkbox"
              name="mixed"
              id="mixed"
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
                ref={registrationDoublePartnerName}
              />
              <input type="text" placeholder="Club" ref={registrationDoublePartnerClub} />
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
                ref={registrationMixedPartnerName}
              />
              <input type="text" placeholder="Club" ref={registrationMixedPartnerClub} />
            </div>
          </div>
        )}
        <div className="form-row">
          <label htmlFor="comments">Commentaires</label>
          <textarea id="comments" cols={30} rows={5} ref={registrationComment}></textarea>
        </div>

        {/* <div className="form-row"></div> */}
        <input type="submit" value="Envoyer ma demande d'inscription" className="btn btn-primary" />
      </form>
    </main>
  );
};

export default NewTournamentRegistration;
