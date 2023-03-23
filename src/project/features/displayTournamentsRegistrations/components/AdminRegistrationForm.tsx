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
import { ITournament, ITournamentRegistration, IUser } from "../../../../interfaces/interfaces";
import { SelectedTournamentContext } from "../../../../contexts/SelectedTournamentContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import Switch from "../../../components/Switch";
import { formatDate } from "../../../../utils/dateFunctions";
import { adminTournamentRegistrationSchema } from "../../../../validations/adminTournamentRegistrationSchema";

interface IProps {
  patchMethod?: boolean;
  focusedRegistration?: ITournamentRegistration;
  isModalActive?: boolean;
  setIsModalActive?: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

interface IFormErrors {
  registrationSelectUser: string;
  registrationUserLastName: string;
  registrationUserFirstName: string;
  registrationUserEmail: string;
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

const AdminRegistrationForm = ({
  patchMethod,
  focusedRegistration,
  setRequestMessage,
  isModalActive,
  setIsModalActive,
}: IProps) => {
  const { selectedTournament } = useContext(SelectedTournamentContext);
  const checkboxSingle = useRef<HTMLInputElement>(null);
  const [checkboxDouble, setCheckboxDouble] = useState(
    focusedRegistration?.participationDouble || false
  );
  const [checkboxMixed, setCheckboxMixed] = useState(
    focusedRegistration?.participationMixed || false
  );
  const [chooseNewTournament, setChooseNewTournament] = useState(
    !focusedRegistration?.id
      ? false
      : (focusedRegistration?.tournament?.id ||
          (selectedTournament && Object.keys(selectedTournament).length)) !== 0
      ? false
      : true
  );
  const [chooseNewUser, setChooseNewUser] = useState(
    !focusedRegistration?.id ? false : focusedRegistration?.user?.id ? false : true
  );
  const registrationSelectUser = useRef<HTMLSelectElement>(null);
  const registrationUserLastName = useRef<HTMLInputElement>(null);
  const registrationUserFirstName = useRef<HTMLInputElement>(null);
  const registrationUserEmail = useRef<HTMLInputElement>(null);
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
  const { data: tournaments, isLoading: tournamentsLoading } = useSWR("/tournaments", fetcher);
  const { data: users, isLoading: usersLoading } = useSWR("/admin/users", fetcher);

  /** Validation of form fields before fetch the post route */
  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors = {} as IFormErrors;

    /** Body of post request */
    const bodyRequest = {
      userLastName: registrationSelectUser.current?.value
        ? users.filter(
            (user: IUser) => user.id === Number(registrationSelectUser.current?.value)
          )[0]?.lastName
        : registrationUserLastName.current?.value || null,
      userFirstName: registrationSelectUser.current?.value
        ? users.filter(
            (user: IUser) => user.id === Number(registrationSelectUser.current?.value)
          )[0]?.firstName
        : registrationUserFirstName.current?.value || null,
      userEmail: registrationSelectUser.current?.value
        ? users.filter(
            (user: IUser) => user.id === Number(registrationSelectUser.current?.value)
          )[0]?.email
        : registrationUserEmail.current?.value || null,
      tournamentName: registrationSelectTournament.current?.value
        ? tournaments.filter(
            (tournament: ITournament) =>
              tournament.id === Number(registrationSelectTournament.current?.value)
          )[0]?.name || ""
        : registrationName.current?.value || null,
      tournamentCity: registrationSelectTournament.current?.value
        ? tournaments.filter(
            (tournament: ITournament) =>
              tournament.id == Number(registrationSelectTournament.current?.value)
          )[0]?.city
        : registrationCity.current?.value || null,
      tournamentStartDate: registrationSelectTournament.current?.value
        ? tournaments.filter(
            (tournament: ITournament) =>
              tournament.id == Number(registrationSelectTournament.current?.value)
          )[0]?.startDate
        : registrationStartDate.current?.value
        ? new Date(registrationStartDate.current?.value).toISOString()
        : null,
      tournamentEndDate: registrationSelectTournament.current?.value
        ? tournaments.filter(
            (tournament: ITournament) =>
              tournament.id == Number(registrationSelectTournament.current?.value)
          )[0]?.endDate
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

    console.log(bodyRequest);

    await adminTournamentRegistrationSchema
      .validate(
        {
          chooseNewUser: chooseNewUser,
          registrationSelectUser: registrationSelectUser.current?.value,
          registrationUserLastName: registrationUserLastName.current?.value,
          registrationUserFirstName: registrationUserFirstName.current?.value,
          registrationUserEmail: registrationUserEmail.current?.value,
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
        isModalActive && setIsModalActive?.(false);
        if (!patchMethod) {
          await mutate(
            "/admin/tournament-registrations",
            await axiosPrivate
              .post("/admin/tournament-registration", bodyRequest)
              .then((res) => {
                setRequestMessage({
                  error: "",
                  success: "La demande d'inscription a bien été créée ! 👌",
                });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  error:
                    "Une erreur est survenue lors de la création de la demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter le web master 😉.",
                  success: "",
                });
              }),
            {
              optimisticData: (all: Array<ITournamentRegistration>) =>
                [...all, bodyRequest as ITournamentRegistration].sort(
                  (a: ITournamentRegistration, b: ITournamentRegistration) =>
                    Number(new Date(b.updatedAt || b.createdAt)) -
                    Number(new Date(a.updatedAt || a.createdAt))
                ),
              populateCache: (
                result: ITournamentRegistration,
                currentRegistrations: Array<ITournamentRegistration>
              ) => [...currentRegistrations, result],
            }
          );
        } else {
          await mutate(
            "/admin/tournament-registrations",
            await axiosPrivate
              .patch(`/admin/tournament-registration/${focusedRegistration?.id}`, bodyRequest)
              .then((res) => {
                setRequestMessage({
                  error: "",
                  success: `La demande d'inscription de ${(
                    focusedRegistration?.user.firstName || focusedRegistration?.userFirstName
                  )?.toUpperCase()} a bien été modifiée ! 👌`,
                });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  error:
                    "Une erreur est survenue lors de la modification de votre demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur.",
                  success: "",
                });
              }),
            {
              optimisticData: (registrations: Array<ITournamentRegistration>) => {
                const prev = registrations.filter(
                  (registration: ITournamentRegistration) =>
                    registration.id !== focusedRegistration?.id
                );
                return [
                  ...prev,
                  { ...focusedRegistration, ...bodyRequest } as ITournamentRegistration,
                ].sort(
                  (a: ITournamentRegistration, b: ITournamentRegistration) =>
                    Number(new Date(b.updatedAt || b.createdAt)) -
                    Number(new Date(a.updatedAt || a.createdAt))
                );
              },
              populateCache: (
                newRegistration: ITournamentRegistration,
                tournamentsRegistrations: Array<ITournamentRegistration>
              ) => {
                const prev = tournamentsRegistrations.filter(
                  (registration: ITournamentRegistration) =>
                    registration.id !== focusedRegistration?.id
                );
                return [...prev, newRegistration];
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
  }, [chooseNewTournament, chooseNewUser]);

  return (
    <form className="form registration-form" onSubmit={handleSubmitForm}>
      <div className="form-row choose-user-identifier">
        <span onClick={() => setChooseNewUser(false)} style={{ cursor: "pointer" }}>
          Membre existant
        </span>
        <Switch customName="toggle-form" isActive={chooseNewUser} setIsActive={setChooseNewUser} />
        <span onClick={() => setChooseNewUser(true)} style={{ cursor: "pointer" }}>
          Nouveau membre
        </span>
      </div>

      {!chooseNewUser ? (
        <div className="form-row">
          <label htmlFor="selectUser">Sélectionner un utilisateur existant</label>
          {formErrors.registrationSelectUser && (
            <div className="form-error-detail">{formErrors.registrationSelectUser}</div>
          )}
          <select
            id="selectUser"
            ref={registrationSelectUser}
            className={formErrors.registrationSelectUser ? "form-error" : undefined}
            defaultValue={focusedRegistration?.user?.id || "null"}
            autoFocus
            required
          >
            <option value="null">---</option>
            {usersLoading
              ? "Chargement..."
              : !users
              ? "Aucun utilisateur"
              : users
                  // .filter((user: IUser) => user.validatedAccount)
                  .sort((a: IUser, b: IUser) => a.lastName.localeCompare(b.lastName))
                  .map((user: IUser) => (
                    <option key={user.id} value={user.id}>
                      {`${user.lastName.toUpperCase()} ${user.firstName}`}
                    </option>
                  ))}
          </select>
        </div>
      ) : (
        <>
          <div className="form-row">
            <label htmlFor="userLastName">Nom du joueur</label>
            {formErrors.registrationUserLastName && (
              <div className="form-error-detail">{formErrors.registrationUserLastName}</div>
            )}
            <input
              type="text"
              id="userLastName"
              className={formErrors.registrationUserLastName ? "form-error" : ""}
              autoFocus
              defaultValue={focusedRegistration?.userLastName || undefined}
              ref={registrationUserLastName}
            />
          </div>
          <div className="form-row">
            <label htmlFor="userFirstName">Prénom du joueur</label>
            {formErrors.registrationUserFirstName && (
              <div className="form-error-detail">{formErrors.registrationUserFirstName}</div>
            )}
            <input
              type="text"
              id="userFirstName"
              className={formErrors.registrationUserFirstName ? "form-error" : ""}
              defaultValue={focusedRegistration?.userFirstName || undefined}
              ref={registrationUserFirstName}
            />
          </div>
          <div className="form-row">
            <label htmlFor="userEmail">Email du joueur</label>
            {formErrors.registrationUserEmail && (
              <div className="form-error-detail">{formErrors.registrationUserEmail}</div>
            )}
            <input
              type="text"
              id="userEmail"
              className={formErrors.registrationUserEmail ? "form-error" : ""}
              defaultValue={focusedRegistration?.userEmail || undefined}
              ref={registrationUserEmail}
            />
          </div>
        </>
      )}

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
            {tournamentsLoading
              ? "Chargement..."
              : !tournaments
              ? "Aucun tournoi"
              : tournaments
                  .filter(
                    (tournament: ITournament) =>
                      new Date(tournament.randomDraw).getTime() - new Date().getTime() > -10 ||
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

      <input
        type="submit"
        value={(patchMethod ? "Modifier" : "Créer") + " la demande d'inscription"}
        className="btn btn-primary"
      />
    </form>
  );
};

export default AdminRegistrationForm;
