import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { ValidationError } from "yup";
import { mutate } from "swr";
import { ITournament, ITournamentRegistration } from "../../../../interfaces/interfaces";
import { SelectedTournamentContext } from "../../../../contexts/SelectedTournamentContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { newTournamentRegistrationSchema } from "../../../../validations/tournamentRegistrationSchema";
import Switch from "../../../components/Switch";
import { formatDate } from "../../../../utils/dateFunctions";

interface IRegistrationFormProps {
  patchMethod?: boolean;
  focusedRegistration?: ITournamentRegistration;
  isModalActive?: boolean;
  setIsModalActive?: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

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

const RegistrationForm = ({
  patchMethod,
  focusedRegistration,
  setRequestMessage,
  isModalActive,
  setIsModalActive,
}: IRegistrationFormProps) => {
  const { selectedTournament } = useContext(SelectedTournamentContext);
  const checkboxSingle = useRef<HTMLInputElement>(null);
  const [checkboxDouble, setCheckboxDouble] = useState(
    focusedRegistration?.participationDouble || false
  );
  const [checkboxMixed, setCheckboxMixed] = useState(
    focusedRegistration?.participationMixed || false
  );
  const [chooseNewTournament, setChooseNewTournament] = useState(
    (focusedRegistration?.tournament?.id ||
      (selectedTournament && Object.keys(selectedTournament).length)) !== 0
      ? false
      : true
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

  /** Fetch tournaments */
  const axiosPrivate = useAxiosPrivate();
  const fetcher = async (url: string) =>
    await axiosPrivate
      .get(url)
      .then((res) => res.data)
      .catch((err) => {});
  //  console.error(err));
  const { data: tournaments, mutate: tournamentsMutate } = useSWR("/tournaments", fetcher);

  /** Validation of form fields before fetch the post route */
  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors = {} as IFormErrors;

    /** Body of post request */
    const bodyRequest = {
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
        : registrationStartDate.current?.value
        ? new Date(registrationStartDate.current?.value).toISOString()
        : null,
      tournamentEndDate: registrationSelectTournament.current?.value
        ? tournaments
            .filter(
              (tournament: ITournament) =>
                tournament.id == Number(registrationSelectTournament.current?.value)
            )
            .map((tournament: ITournament) => tournament.endDate)[0]
        : registrationEndDate.current?.value && registrationEndDate.current.value !== ""
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
    };

    await newTournamentRegistrationSchema
      .validate(
        {
          chooseNewTournament: chooseNewTournament,
          registrationSelectTournament: registrationSelectTournament.current?.value,
          registrationName: registrationName.current?.value,
          registrationCity: registrationCity.current?.value,
          registrationStartDate: registrationStartDate.current?.value,
          registrationEndDate: registrationEndDate.current?.value
            ? new Date(registrationEndDate.current?.value)
            : undefined,
          checkboxes: [checkboxSingle.current?.checked, checkboxDouble, checkboxMixed],
          registrationDoublePartnerName: registrationDoublePartnerName.current?.value,
          registrationDoublePartnerClub: registrationDoublePartnerClub.current?.value,
          registrationMixedPartnerName: registrationMixedPartnerName.current?.value,
          registrationMixedPartnerClub: registrationMixedPartnerClub.current?.value,
        },
        { abortEarly: false }
      )
      .then(async () => {
        if (!patchMethod) {
          await axiosPrivate
            .post("tournament-registration", bodyRequest)
            .then(() =>
              setRequestMessage({
                error: "",
                success: "Votre demande d'inscription a bien été créée ! 👌",
              })
            )
            .catch((err) => {
              console.error(err);
              setRequestMessage({
                error:
                  "Une erreur est survenue lors de l'envoi de votre demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur.",
                success: "",
              });
            });
        } else {
          isModalActive && setIsModalActive?.(false);

          await mutate(
            "tournament-registrations",
            await axiosPrivate
              .patch(`tournament-registration/${focusedRegistration?.id}`, bodyRequest)
              .then((res) => {
                setRequestMessage({
                  error: "",
                  success: "Votre demande d'inscription a bien été modifiée ! 👌",
                });
                return res.data;
              })
              .catch((err) => {
                // console.error(err)
                setRequestMessage({
                  error:
                    "Une erreur est survenue lors de la modification de votre demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur.",
                  success: "",
                });
              }),
            {
              optimisticData: (tournamentsRegistrations: Array<ITournamentRegistration>) => {
                const prevRegistrations = tournamentsRegistrations.filter(
                  (registration: ITournamentRegistration) =>
                    registration.id !== focusedRegistration?.id
                );
                return [...prevRegistrations, { ...focusedRegistration, ...bodyRequest }];
              },
              populateCache: (
                updated: ITournamentRegistration,
                tournamentsRegistrations: Array<ITournamentRegistration>
              ) => {
                const prevRegistrations = tournamentsRegistrations.filter(
                  (registration: ITournamentRegistration) =>
                    registration.id !== focusedRegistration?.id
                );
                return [...prevRegistrations, updated];
              },
              rollbackOnError: true,
              revalidate: false,
            }
          );
        }

        setTimeout(() => {
          setRequestMessage({ success: "", error: "" });
        }, 10000);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        err.inner.forEach(
          (err: ValidationError) => (errors = { ...errors, [err.path as string]: err.message })
        );
      });

    setFormErrors(errors);
  };

  useEffect(() => {
    setFormErrors({} as IFormErrors);
  }, [chooseNewTournament]);

  return (
    <form className="form registration-form" onSubmit={handleSubmitForm}>
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
            defaultValue={focusedRegistration?.tournament?.id || selectedTournament?.id || "null"}
            autoFocus
            required
          >
            <option value="null">---</option>
            {!tournaments
              ? "Chargement..."
              : tournaments
                  .filter(
                    (tournament: ITournament) =>
                      (tournament.randomDraw &&
                        tournament.randomDraw.getTime() - new Date().getTime() > -10) ||
                      tournament.id === focusedRegistration?.tournament?.id
                  )
                  .sort(
                    (a: ITournament, b: ITournament) =>
                      Number(new Date(a.startDate)) - Number(new Date(b.startDate))
                  )
                  .map((tournament: ITournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name?.slice(0, 20) + "..." || "ℹ️"} - {tournament.city} -{" "}
                      {tournament.endDate
                        ? formatDate(
                            String(tournament.startDate),
                            String(tournament.endDate),
                            "XX & XX xxx XXXX"
                          )
                        : formatDate(String(tournament.startDate), undefined, "XX xxx XXXX")}
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
              defaultValue={focusedRegistration?.tournamentName || undefined}
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
              defaultValue={focusedRegistration?.tournamentCity || undefined}
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
                defaultValue={
                  (focusedRegistration?.tournamentStartDate &&
                    formatDate(
                      focusedRegistration?.tournamentStartDate,
                      undefined,
                      "XXXX-XX-XX"
                    )) ||
                  undefined
                }
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
                defaultValue={
                  (focusedRegistration?.tournamentEndDate &&
                    formatDate(focusedRegistration?.tournamentEndDate, undefined, "XXXX-XX-XX")) ||
                  undefined
                }
              />
            </div>
          </div>
        </>
      )}

      <div className="checkboxes-container">
        {formErrors.checkboxes && <div className="form-error-detail">{formErrors.checkboxes}</div>}
        <div className="checkboxes">
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
              defaultChecked={focusedRegistration?.participationDouble || false}
              onChange={() => setCheckboxDouble((prev) => !prev)}
            />
            <label htmlFor="double">Double</label>
          </div>
          <div className="form-row">
            <input
              type="checkbox"
              name="mixed"
              id="mixed"
              defaultChecked={focusedRegistration?.participationMixed || false}
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
              defaultValue={focusedRegistration?.doublePartnerName || undefined}
            />
            <input
              type="text"
              placeholder="Club"
              ref={registrationDoublePartnerClub}
              defaultValue={focusedRegistration?.doublePartnerClub || undefined}
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
              placeholder="NOM / Prénom | Laisser vide si X"
              ref={registrationMixedPartnerName}
              defaultValue={focusedRegistration?.mixedPartnerName || undefined}
            />
            <input
              type="text"
              placeholder="Club"
              ref={registrationMixedPartnerClub}
              defaultValue={focusedRegistration?.mixedPartnerClub || undefined}
            />
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
          defaultValue={focusedRegistration?.comment || undefined}
        ></textarea>
      </div>

      {/* <div className="form-row"></div> */}
      <input
        type="submit"
        value={(patchMethod ? "Modifier" : "Envoyer") + " ma demande d'inscription"}
        className="btn btn-primary"
      />
    </form>
  );
};

export default RegistrationForm;
