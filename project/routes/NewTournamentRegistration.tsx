import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "../../config/dateFunctions";
import { ITournament } from "../../config/interfaces";
import useSWR from "swr";
import Switch from "../components/Switch";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { SelectedTournamentContext } from "../../contexts/SelectedTournamentContext";

interface IFormErrors {
  registrationSelectTournament: string;
  registrationName: string;
  registrationCity: string;
  registrationStartDate: string;
  registrationEndDate: string;
  checkboxes: string;
  registrationDoublePartnerName: string;
  registrationMixedPartnerName: string;
  registrationDoublePartnerClub: string;
  registrationMixedPartnerClub: string;
  comment: string;
}

const NewTournamentRegistration = () => {
  const { selectedTournament } = useContext(SelectedTournamentContext);
  const checkboxSingle = useRef<HTMLInputElement>(null);
  const [checkboxDouble, setCheckboxDouble] = useState(false);
  const [checkboxMixed, setCheckboxMixed] = useState(false);
  const [chooseNewTournament, setChooseNewTournament] = useState(
    selectedTournament && Object.keys(selectedTournament).length !== 0 ? false : true
  );
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
  const [formErrors, setFormErrors] = useState({} as IFormErrors);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });

  /** Fetch tournaments */
  const axiosPrivate = useAxiosPrivate();
  const fetcher = async (url: string) =>
    await axiosPrivate
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.error(err));
  const { data: tournaments, mutate: tournamentsMutate } = useSWR("tournaments", fetcher);

  /** Validation of form fields before fetch the post route */
  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(registrationSelectTournament.current?.value);

    let errors = { ...formErrors };

    console.log(
      Object.values(formErrors).length === 0 ||
        Object.values(formErrors).every((error) => error === "")
    );

    if (!chooseNewTournament) {
      registrationSelectTournament.current?.value === "null"
        ? (errors.registrationSelectTournament =
            'Vous devez sélectionner un tournoi parmi la liste proposée (sinon utilisez le formulaire détaillé en cliquant sur "Nouveau tournoi"')
        : (errors.registrationSelectTournament = "");
      // errors.registrationName = "";
      // errors.registrationCity = "";
      // errors.registrationStartDate = "";
    } else {
      !registrationName.current?.value.match(/^[\w\-]*$/)
        ? (errors.registrationName =
            "Le nom du tournoi ne doit pas contenir de caractères spéciaux.")
        : (errors.registrationName = "");

      !registrationCity.current?.value.match(/^[\w\-]{3,}$/)
        ? (errors.registrationCity =
            "La ville du tournoi doit posséder 3 caractères minimum et ne doit pas contenir de caractères spéciaux.")
        : (errors.registrationCity = "");

      !registrationStartDate.current?.value
        ? (errors.registrationStartDate = "Un tournoi doit avoir une date de début.")
        : (Number(new Date()) - Number(new Date(registrationStartDate.current?.value))) /
            (1000 * 3600 * 24) >
          1
        ? (errors.registrationStartDate =
            "La date de début du tournoi ne peut être antérieure à aujourd'hui.")
        : (errors.registrationStartDate = "");

      registrationEndDate.current?.value &&
      new Date(registrationEndDate.current?.value) < new Date(registrationStartDate.current?.value!)
        ? (errors.registrationEndDate =
            "La date de fin du tournoi ne peut être antérieure à celle de la date du début.")
        : (errors.registrationEndDate = "");
    }

    !checkboxSingle.current?.checked && !checkboxDouble && !checkboxMixed
      ? (errors.checkboxes = "Un tableau doit être au minimum sélectionné.")
      : (errors.checkboxes = "");

    registrationDoublePartnerName.current?.value &&
    !registrationDoublePartnerName.current?.value.match(/^[\w\-]*$/)
      ? (errors.registrationDoublePartnerName =
          "Le nom du partenaire de double ne peut pas contenir de caractères spéciaux")
      : (errors.registrationDoublePartnerName = "");

    registrationMixedPartnerName.current?.value &&
    !registrationMixedPartnerName.current?.value.match(/^[\w\-]*$/)
      ? (errors.registrationMixedPartnerName =
          "Le nom du partenaire de mixte ne peut pas contenir de caractères spéciaux")
      : (errors.registrationMixedPartnerName = "");

    registrationDoublePartnerClub.current?.value &&
    !registrationDoublePartnerClub.current?.value.match(/^[\w\-]*$/)
      ? (errors.registrationDoublePartnerName =
          "Le club du partenaire de double ne peut pas contenir de caractères spéciaux")
      : (errors.registrationDoublePartnerName = "");

    registrationMixedPartnerClub.current?.value &&
    !registrationMixedPartnerClub.current?.value.match(/^[\w\-]*$/)
      ? (errors.registrationMixedPartnerName =
          "Le club du partenaire de mixte ne peut pas contenir de caractères spéciaux")
      : (errors.registrationMixedPartnerName = "");

    registrationComment.current?.value && registrationComment.current?.value.match(/[<>]|[</>]/)
      ? (errors.comment = "Certains caractères sont interdits.")
      : (errors.comment = "");

    if (
      Object.values(formErrors).length === 0 ||
      Object.values(formErrors).every((error) => error === "")
    ) {
      console.log("axios");

      // await axiosPrivate
      //   .post("tournament-registration", {
      //     tournamentName: registrationSelectTournament.current?.value
      //       ? tournaments
      //           .filter(
      //             (tournament: ITournament) =>
      //               tournament.id == Number(registrationSelectTournament.current?.value)
      //           )
      //           .map((tournament: ITournament) => tournament.name)[0]
      //       : registrationName.current
      //       ? registrationName.current?.value
      //       : null,
      //     tournamentCity: registrationSelectTournament.current?.value
      //       ? tournaments

      //           .filter(
      //             (tournament: ITournament) =>
      //               tournament.id == Number(registrationSelectTournament.current?.value)
      //           )
      //           .map((tournament: ITournament) => tournament.city)[0]
      //       : registrationCity.current
      //       ? registrationCity.current?.value
      //       : null,
      //     tournamentStartDate: registrationSelectTournament.current?.value
      //       ? tournaments
      //           .filter(
      //             (tournament: ITournament) =>
      //               tournament.id == Number(registrationSelectTournament.current?.value)
      //           )
      //           .map((tournament: ITournament) => tournament.startDate)[0]
      //       : registrationStartDate.current
      //       ? new Date(registrationStartDate.current?.value).toISOString()
      //       : null,
      //     tournamentEndDate: registrationSelectTournament.current?.value
      //       ? tournaments
      //           .filter(
      //             (tournament: ITournament) =>
      //               tournament.id == Number(registrationSelectTournament.current?.value)
      //           )
      //           .map((tournament: ITournament) => tournament.endDate)[0]
      //       : registrationEndDate.current && registrationEndDate.current.value !== ""
      //       ? new Date(registrationEndDate.current?.value).toISOString()
      //       : null,

      //     participationSingle: checkboxSingle.current?.checked,
      //     participationDouble: checkboxDouble,
      //     participationMixed: checkboxMixed,
      //     doublePartnerName: registrationDoublePartnerName.current?.value || null,
      //     doublePartnerClub: registrationDoublePartnerClub.current?.value || null,
      //     mixedPartnerName: registrationMixedPartnerName.current?.value || null,
      //     mixedPartnerClub: registrationMixedPartnerClub.current?.value || null,
      //     comment: registrationComment.current?.value || null,
      //   })
      //   .then((res: unknown) =>
      //     setRequestMessage({
      //       error: "",
      //       success: "Votre demande d'inscription a bien été créée ! 👌",
      //     })
      //   )
      //   .catch((err: unknown) => {
      //     console.error(err);
      //     setRequestMessage({
      //       error:
      //         "Une erreur est survenue lors de l'envoi de votre demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur. ",
      //       success: "",
      //     });
      //   });
    } else {
      setRequestMessage({ error: "", success: "" });
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
  };

  useEffect(() => {
    setFormErrors({} as IFormErrors);
  }, [chooseNewTournament]);

  return (
    <main className="new-registration user-space">
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
      <h2>Demande d&apos;inscription à un tournoi</h2>

      <form className="form" onSubmit={handleSubmitForm}>
        <div className="form-row choose-tournament-identifier">
          <span onClick={() => setChooseNewTournament(false)} style={{ cursor: "pointer" }}>
            Tournoi existant
          </span>
          <Switch
            customName="toggle-form"
            isActive={chooseNewTournament}
            setIsActive={setChooseNewTournament}
          />
          <span onClick={() => setChooseNewTournament(true)} style={{ cursor: "pointer" }}>
            Nouveau tournoi
          </span>
        </div>

        {!chooseNewTournament ? (
          <div className="form-row">
            <label htmlFor="selectTournament">Sélectionner un tournoi existant</label>
            {formErrors.registrationSelectTournament && (
              <div className="form-error-detail">{formErrors.registrationSelectTournament}</div>
            )}
            <select
              id="selectTournament"
              ref={registrationSelectTournament}
              className={formErrors.registrationSelectTournament ? "form-error" : ""}
              defaultValue={selectedTournament?.id || "null"}
              autoFocus
              required
            >
              <option value="null">---</option>
              {!tournaments
                ? "Chargement..."
                : tournaments
                    .filter(
                      (tournament: ITournament) =>
                        new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10
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
              {formErrors.registrationName && (
                <div className="form-error-detail">{formErrors.registrationName}</div>
              )}
              <input
                type="text"
                id="tournamentName"
                className={formErrors.registrationName ? "form-error" : ""}
                autoFocus
                ref={registrationName}
              />
            </div>
            <div className="form-row">
              <label htmlFor="tournamentCity">Ville du tournoi</label>
              {formErrors.registrationCity && (
                <div className="form-error-detail">{formErrors.registrationCity}</div>
              )}
              <input
                type="text"
                id="tournamentCity"
                className={formErrors.registrationCity ? "form-error" : ""}
                ref={registrationCity}
                required
              />
            </div>
            <div className="form-row">
              {formErrors.registrationStartDate && (
                <div className="form-error-detail">{formErrors.registrationStartDate}</div>
              )}
              {formErrors.registrationEndDate && (
                <div className="form-error-detail">{formErrors.registrationEndDate}</div>
              )}
              <div className="dates">
                <label htmlFor="startDate">Du </label>
                <input
                  type="date"
                  id="startDate"
                  ref={registrationStartDate}
                  min={formatDate(new Date().toISOString(), undefined, "XXXX-XX-XX")}
                  required
                />
                <label htmlFor="endDate"> au </label>
                <input
                  type="date"
                  id="endDate"
                  ref={registrationEndDate}
                  min={
                    registrationStartDate.current?.value
                      ? formatDate(
                          new Date(
                            new Date(registrationStartDate.current?.value!).setDate(
                              new Date(registrationStartDate.current?.value!).getDate() + 1
                            )
                          ).toISOString(),
                          undefined,
                          "XXXX-XX-XX"
                        )
                      : undefined
                  }
                />
              </div>
            </div>
          </>
        )}
        <div className="checkboxes-container">
          {formErrors.checkboxes && (
            <div className="form-error-detail">{formErrors.checkboxes}</div>
          )}
          <div className="checkboxes">
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
        </div>
        {checkboxDouble && (
          <div className="form-row">
            <label htmlFor="doublePartner">Partenaire de Double</label>
            <div className="partner-container">
              <input
                type="text"
                id="doublePartner"
                placeholder="NOM / Prénom | Laisser vide si X"
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
                placeholder="NOM / Prénom | Laisser vide si X"
                ref={registrationMixedPartnerName}
              />
              <input type="text" placeholder="Club" ref={registrationMixedPartnerClub} />
            </div>
          </div>
        )}
        <div className="form-row">
          <label htmlFor="comments">Commentaires</label>
          {formErrors.comment && <div className="form-error-detail">{formErrors.comment}</div>}
          <textarea
            id="comments"
            cols={30}
            rows={5}
            className={formErrors.comment ? "form-error" : ""}
            ref={registrationComment}
          ></textarea>
        </div>

        {/* <div className="form-row"></div> */}
        <input type="submit" value="Envoyer ma demande d'inscription" className="btn btn-primary" />
      </form>
    </main>
  );
};

export default NewTournamentRegistration;
