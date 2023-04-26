import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { ITournament } from "../../../interfaces/interfaces";
import { formatDate } from "../../../utils/dateFunctions";
import { tournamentSchema } from "../../../validations/tournamentSchema";
import { mutate } from "swr";
import { ValidationError } from "yup";
import useAxiosPrivateMultipart from "../../../hooks/useAxiosPrivateMultipart";

interface IProps {
  patchMethod?: boolean;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  focusedTournament: ITournament;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

interface IFormErrors {
  name: string;
  city: string;
  startDate: string;
  endDate: string;
  isTeamCompetition: string;
  standardPrice1: string;
  standardPrice2: string;
  standardPrice3: string;
  elitePrice1: string;
  elitePrice2: string;
  elitePrice3: string;
  priceSingle: string;
  priceDouble: string;
  priceMixed: string;
  registrationClosingDate: string;
  randomDraw: string;
  emailContact: string;
  telContact: string;
  registrationMethod: string;
  paymentMethod: string;
  comment: string;
}

const TournamentForm = ({
  patchMethod,
  focusedTournament,
  setIsModalActive,
  setRequestMessage,
}: IProps) => {
  const axiosPrivateMultipart = useAxiosPrivateMultipart();
  const [formErrors, setFormErrors] = useState({} as IFormErrors);
  const tournamentNameRef = useRef<HTMLInputElement>(null);
  const tournamentCityRef = useRef<HTMLInputElement>(null);
  const tournamentStartDateRef = useRef<HTMLInputElement>(null);
  const tournamentEndDateRef = useRef<HTMLInputElement>(null);
  const isTournamentTeamCompetitionRef = useRef<HTMLInputElement>(null);
  const tournamentStandardPrice1Ref = useRef<HTMLInputElement>(null);
  const tournamentStandardPrice2Ref = useRef<HTMLInputElement>(null);
  const tournamentStandardPrice3Ref = useRef<HTMLInputElement>(null);
  const tournamentElitePrice1Ref = useRef<HTMLInputElement>(null);
  const tournamentElitePrice2Ref = useRef<HTMLInputElement>(null);
  const tournamentElitePrice3Ref = useRef<HTMLInputElement>(null);
  const tournamentPriceSingleRef = useRef<HTMLInputElement>(null);
  const tournamentPriceDoubleRef = useRef<HTMLInputElement>(null);
  const tournamentPriceMixedRef = useRef<HTMLInputElement>(null);
  const tournamentRegistrationClosingDateRef = useRef<HTMLInputElement>(null);
  const tournamentRandomDrawRef = useRef<HTMLInputElement>(null);
  const tournamentEmailContactRef = useRef<HTMLInputElement>(null);
  const tournamentTelContactRef = useRef<HTMLInputElement>(null);
  const tournamentRegistrationMethodRef = useRef<HTMLInputElement>(null);
  const tournamentPaymentMethodRef = useRef<HTMLInputElement>(null);
  const tournamentFileRef = useRef<HTMLInputElement>(null);
  const tournamentCommentRef = useRef<HTMLTextAreaElement>(null);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let errors = {} as IFormErrors;

    const bodyRequest = {
      name: tournamentNameRef.current?.value || null,
      city: tournamentCityRef.current!.value,
      startDate: tournamentStartDateRef.current!.valueAsDate!,
      endDate: tournamentEndDateRef.current?.valueAsDate || null,
      isTeamCompetition: isTournamentTeamCompetitionRef.current!.checked,
      standardPrice1: tournamentStandardPrice1Ref.current?.valueAsNumber || null,
      standardPrice2: tournamentStandardPrice2Ref.current?.valueAsNumber || null,
      standardPrice3: tournamentStandardPrice3Ref.current?.valueAsNumber || null,
      elitePrice1: tournamentElitePrice1Ref.current?.valueAsNumber || null,
      elitePrice2: tournamentElitePrice2Ref.current?.valueAsNumber || null,
      elitePrice3: tournamentElitePrice3Ref.current?.valueAsNumber || null,
      priceSingle: tournamentPriceSingleRef.current?.valueAsNumber || null,
      priceDouble: tournamentPriceDoubleRef.current?.valueAsNumber || null,
      priceMixed: tournamentPriceMixedRef.current?.valueAsNumber || null,
      registrationClosingDate: tournamentRegistrationClosingDateRef.current?.valueAsDate || null,
      randomDraw: tournamentRandomDrawRef.current?.valueAsDate || null,
      emailContact: tournamentEmailContactRef.current?.value || null,
      telContact: tournamentTelContactRef.current?.value || null,
      registrationMethod: tournamentRegistrationMethodRef.current?.value || null,
      paymentMethod: tournamentPaymentMethodRef.current?.value || null,
      comment: tournamentCommentRef.current?.value || null,
    };

    await tournamentSchema
      .validate(bodyRequest, { abortEarly: false })
      .then(async () => {
        setIsModalActive?.(false);

        let formData = new FormData();
        tournamentFileRef.current?.files?.[0] &&
          formData.append("file", tournamentFileRef.current?.files[0]);
        formData.append("data", JSON.stringify(bodyRequest));

        if (!patchMethod) {
          await mutate(
            "/tournaments",
            await axiosPrivateMultipart
              .post("/admin/tournament", formData)
              .then((res) => {
                setRequestMessage({ success: "Le tournoi a bien été créé ! 👌", error: "" });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  success: "",
                  error: "Une erreur est survenue lors de la création du tournoi ! 🤕",
                });
              }),
            {
              optimisticData: (tournaments: Array<ITournament>) =>
                [
                  ...tournaments,
                  { id: tournaments.slice(-1)[0].id + 1, ...bodyRequest } as ITournament,
                ].sort(
                  (a: ITournament, b: ITournament) =>
                    Number(new Date(a.startDate)) - Number(new Date(b.startDate))
                ),
              populateCache: (newTournament: ITournament, tournaments: Array<ITournament>) => [
                ...tournaments,
                newTournament,
              ],
              revalidate: false,
              rollbackOnError: true,
            }
          );
        } else {
          await mutate(
            "/tournaments",
            axiosPrivateMultipart
              .post(`/admin/tournament/${focusedTournament.id}`, formData)
              .then((res) => {
                setRequestMessage({ success: "Le tournoi a bien été modifié ! 👌", error: "" });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  success: "",
                  error: "Une erreur est survenue lors de la modification du tournoi ! 🤕",
                });
              }),
            {
              optimisticData: (tournaments: Array<ITournament>) => {
                const prev = tournaments.filter(
                  (tournament: ITournament) => tournament.id !== focusedTournament.id
                );
                return [...prev, { id: focusedTournament.id, ...bodyRequest } as ITournament].sort(
                  (a: ITournament, b: ITournament) =>
                    Number(new Date(a.startDate)) - Number(new Date(b.startDate))
                );
              },
              populateCache: (newTournament: ITournament, tournaments: Array<ITournament>) => {
                const prev = tournaments.filter(
                  (tournament: ITournament) => tournament.id !== focusedTournament.id
                );
                return [...prev, newTournament];
              },
              revalidate: false,
              rollbackOnError: true,
            }
          );
        }

        setTimeout(() => {
          setRequestMessage({ success: "", error: "" });
        }, 10000);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.dir(err);

        err.inner.forEach(
          (err: ValidationError) => (errors = { ...errors, [err.path as string]: err.message })
        );
      });

    setFormErrors(errors);
  };

  //
  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <div className="form-row">
        <label htmlFor="tournamentName">Nom du tournoi</label>
        {formErrors.name && <div className="form-error-detail">{formErrors.name}</div>}
        <input
          type="text"
          id="tournamentName"
          className={formErrors.name ? "form-error" : undefined}
          autoFocus
          defaultValue={focusedTournament?.name || undefined}
          ref={tournamentNameRef}
        />
      </div>
      <div className="form-row">
        <label htmlFor="tournamentCity">Ville du tournoi</label>
        {formErrors.city && <div className="form-error-detail">{formErrors.city}</div>}
        <input
          type="text"
          id="tournamentCity"
          className={formErrors.city ? "form-error" : undefined}
          ref={tournamentCityRef}
          defaultValue={focusedTournament?.city || undefined}
          required
        />
      </div>
      <div className="form-row">
        {formErrors.startDate && <div className="form-error-detail">{formErrors.startDate}</div>}
        {formErrors.endDate && <div className="form-error-detail">{formErrors.endDate}</div>}
        <div className="dates">
          <label htmlFor="startDate">Du </label>
          <input
            type="date"
            id="startDate"
            className={formErrors.startDate ? "form-error" : undefined}
            ref={tournamentStartDateRef}
            // min={formatDate(new Date().toISOString(), undefined, "XXXX-XX-XX")}
            defaultValue={
              (focusedTournament?.startDate &&
                formatDate(String(focusedTournament?.startDate), undefined, "XXXX-XX-XX")) ||
              undefined
            }
            required
          />
          <label htmlFor="endDate"> au </label>
          <input
            type="date"
            id="endDate"
            className={formErrors.endDate ? "form-error" : undefined}
            ref={tournamentEndDateRef}
            // min={formatDate(new Date().toISOString(), undefined, "XXXX-XX-XX")}
            defaultValue={
              (focusedTournament?.endDate &&
                formatDate(String(focusedTournament?.endDate), undefined, "XXXX-XX-XX")) ||
              undefined
            }
          />
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="isTeamCompetition">Est-ce une compétition par équipe ?</label>
        {formErrors.isTeamCompetition && (
          <div className="form-error-detail">{formErrors.isTeamCompetition}</div>
        )}
        <input
          type="checkbox"
          name="isTeamCompetition"
          id="isTeamCompetition"
          className={formErrors.isTeamCompetition ? "form-error" : undefined}
          ref={isTournamentTeamCompetitionRef}
          defaultChecked={focusedTournament?.isTeamCompetition || false}
        />
      </div>

      <div className="form-row">
        <div className="prices">
          {formErrors.standardPrice1 && (
            <div className="form-error-detail">{formErrors.standardPrice1}</div>
          )}
          {formErrors.standardPrice2 && (
            <div className="form-error-detail">{formErrors.standardPrice2}</div>
          )}
          {formErrors.standardPrice3 && (
            <div className="form-error-detail">{formErrors.standardPrice3}</div>
          )}
          <div className="prices-content">
            <div className="price">
              <label htmlFor="standardPrice3">Prix 1 tableau</label>

              <input
                type="number"
                name="standardPrice1"
                id="standardPrice1"
                className={formErrors.standardPrice1 ? "form-error" : undefined}
                ref={tournamentStandardPrice1Ref}
                defaultValue={focusedTournament?.standardPrice1 || undefined}
              />
            </div>
            <div className="price">
              <label htmlFor="standardPrice2">Prix 2 tableaux</label>
              <input
                type="number"
                name="standardPrice2"
                id="standardPrice2"
                className={formErrors.standardPrice2 ? "form-error" : undefined}
                ref={tournamentStandardPrice2Ref}
                defaultValue={focusedTournament?.standardPrice2 || undefined}
              />
            </div>
            <div className="price">
              <label htmlFor="standardPrice3">Prix 3 tableaux</label>
              <input
                type="number"
                name="standardPrice3"
                id="standardPrice3"
                className={formErrors.standardPrice3 ? "form-error" : undefined}
                ref={tournamentStandardPrice3Ref}
                defaultValue={focusedTournament?.standardPrice3 || undefined}
              />
            </div>
          </div>
          <div className="form-separator"></div>
          {formErrors.elitePrice1 && (
            <div className="form-error-detail">{formErrors.elitePrice1}</div>
          )}
          {formErrors.elitePrice2 && (
            <div className="form-error-detail">{formErrors.elitePrice2}</div>
          )}
          {formErrors.elitePrice3 && (
            <div className="form-error-detail">{formErrors.elitePrice3}</div>
          )}
          <div className="prices-content">
            <div className="price">
              <label htmlFor="elitePrice1">Prix élite 1 tableau</label>
              <input
                type="number"
                name="elitePrice1"
                id="elitePrice1"
                className={formErrors.elitePrice1 ? "form-error" : undefined}
                ref={tournamentElitePrice1Ref}
                defaultValue={focusedTournament?.elitePrice1 || undefined}
              />
            </div>
            <div className="price">
              <label htmlFor="elitePrice2">Prix élite 2 tableaux</label>
              <input
                type="number"
                name="elitePrice2"
                id="elitePrice2"
                className={formErrors.elitePrice2 ? "form-error" : undefined}
                ref={tournamentElitePrice2Ref}
                defaultValue={focusedTournament?.elitePrice2 || undefined}
              />
            </div>
            <div className="price">
              <label htmlFor="elitePrice3">Prix élite 3 tableaux</label>
              <input
                type="number"
                name="elitePrice3"
                id="elitePrice3"
                className={formErrors.elitePrice3 ? "form-error" : undefined}
                ref={tournamentElitePrice3Ref}
                defaultValue={focusedTournament?.elitePrice3 || undefined}
              />
            </div>
          </div>
          <div className="form-separator"></div>
          {formErrors.priceSingle && (
            <div className="form-error-detail">{formErrors.priceSingle}</div>
          )}
          {formErrors.priceDouble && (
            <div className="form-error-detail">{formErrors.priceDouble}</div>
          )}
          {formErrors.priceMixed && (
            <div className="form-error-detail">{formErrors.priceMixed}</div>
          )}
          <div className="prices-content">
            <div className="price">
              <label htmlFor="priceSingle">Prix tableau simple</label>
              <input
                type="number"
                name="priceSingle"
                id="priceSingle"
                className={formErrors.priceSingle ? "form-error" : undefined}
                ref={tournamentPriceSingleRef}
                defaultValue={focusedTournament?.priceSingle || undefined}
              />
            </div>
            <div className="price">
              <label htmlFor="priceDouble">Prix tableau double</label>
              <input
                type="number"
                name="priceDouble"
                id="priceDouble"
                className={formErrors.priceDouble ? "form-error" : undefined}
                ref={tournamentPriceDoubleRef}
                defaultValue={focusedTournament?.priceDouble || undefined}
              />
            </div>
            <div className="price">
              <label htmlFor="priceMixed">Prix tableau mixte</label>
              <input
                type="number"
                name="priceMixed"
                id="priceMixed"
                className={formErrors.priceMixed ? "form-error" : undefined}
                ref={tournamentPriceMixedRef}
                defaultValue={focusedTournament?.priceMixed || undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="registrationClosingDate">Date de limite d&apos;inscription</label>
        {formErrors.registrationClosingDate && (
          <div className="form-error-detail">{formErrors.registrationClosingDate}</div>
        )}
        <input
          type="date"
          name="registrationClosingDate"
          id="registrationClosingDate"
          className={formErrors.registrationClosingDate ? "form-error" : undefined}
          ref={tournamentRegistrationClosingDateRef}
          defaultValue={
            (focusedTournament?.registrationClosingDate &&
              formatDate(
                (String(focusedTournament?.registrationClosingDate), undefined, "XXXX-XX-XX")
              )) ||
            undefined
          }
        />
      </div>

      <div className="form-row">
        <label htmlFor="randomDrawDate">Date du Tirage au sort (TauS)</label>
        {formErrors.randomDraw && <div className="form-error-detail">{formErrors.randomDraw}</div>}
        <input
          type="date"
          name="randomDrawDate"
          id="randomDrawDate"
          className={formErrors.randomDraw ? "form-error" : undefined}
          ref={tournamentRandomDrawRef}
          defaultValue={
            (focusedTournament?.randomDraw &&
              formatDate(String(focusedTournament?.randomDraw), undefined, "XXXX-XX-XX")) ||
            undefined
          }
        />
      </div>

      <div className="form-row">
        <label htmlFor="emailContact">Email de l&apos;organisateur</label>
        {formErrors.emailContact && (
          <div className="form-error-detail">{formErrors.emailContact}</div>
        )}
        <input
          type="email"
          name="emailContact"
          id="emailContact"
          className={formErrors.emailContact ? "form-error" : undefined}
          ref={tournamentEmailContactRef}
          defaultValue={focusedTournament?.emailContact || undefined}
        />
      </div>

      <div className="form-row">
        <label htmlFor="telContact">Téléphone de l&apos;organisateur</label>
        {formErrors.telContact && <div className="form-error-detail">{formErrors.telContact}</div>}
        <input
          type="tel"
          name="telContact"
          id="telContact"
          className={formErrors.telContact ? "form-error" : undefined}
          pattern="0[0-9]{9}"
          min={10}
          max={12}
          ref={tournamentTelContactRef}
          defaultValue={focusedTournament?.telContact || undefined}
        />
      </div>

      <div className="form-row">
        <label htmlFor="registrationMethod">Méthode d&apos;inscription</label>
        {formErrors.registrationMethod && (
          <div className="form-error-detail">{formErrors.registrationMethod}</div>
        )}
        <input
          type="text"
          name="registrationMethod"
          id="registrationMethod"
          className={formErrors.telContact ? "form-error" : undefined}
          list="registrationMethodList"
          ref={tournamentRegistrationMethodRef}
          defaultValue={focusedTournament?.registrationMethod || undefined}
        />
        <datalist id="registrationMethodList">
          <option value="Badnet / eBad"></option>
          <option value="Email"></option>
          <option value="Courrier"></option>
          <option value="Site interne du club"></option>
        </datalist>
      </div>

      <div className="form-row">
        <label htmlFor="paymentMethod">Méthode de paiement</label>
        {formErrors.paymentMethod && (
          <div className="form-error-detail">{formErrors.paymentMethod}</div>
        )}
        <input
          type="text"
          name="paymentMethod"
          id="paymentMethod"
          className={formErrors.paymentMethod ? "form-error" : undefined}
          list="paymentMethodList"
          ref={tournamentPaymentMethodRef}
          defaultValue={focusedTournament?.paymentMethod || undefined}
        />
        <datalist id="paymentMethodList">
          <option value="Portefeuille Badnet"></option>
          <option value="CB"></option>
          <option value="Virement"></option>
          <option value="Chèque"></option>
          <option value="Espèces"></option>
        </datalist>
      </div>

      <div className="form-row">
        <label htmlFor="file">Importer le réglement</label>
        <input type="file" name="file" id="file" ref={tournamentFileRef} />
      </div>

      <div className="form-row">
        <label htmlFor="comment">Commentaires</label>
        {formErrors.comment && <div className="form-error-detail">{formErrors.comment}</div>}
        <textarea
          name="comment"
          id="comment"
          className={formErrors.comment ? "form-error" : undefined}
          ref={tournamentCommentRef}
          defaultValue={focusedTournament?.comment || undefined}
        ></textarea>
      </div>

      <input
        type="submit"
        value={`${patchMethod ? "Modifier" : "Créer"} le tournoi`}
        // value={(patchMethod ? "Modifier" : "Créer") + " le tournoi"}
        className="btn btn-primary"
      />
    </form>
  );
};

export default TournamentForm;
