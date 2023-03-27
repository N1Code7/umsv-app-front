import { Dispatch, SetStateAction, useRef, useState } from "react";
import { ITournament } from "../../../../interfaces/interfaces";
import { formatDate } from "../../../../utils/dateFunctions";

interface IProps {
  isModalActive: boolean;
  patchMethod?: string;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  focusedTournament: ITournament;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

interface IFormErrors {
  tournamentName: string;
  tournamentCity: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
}

const TournamentForm = ({ isModalActive, setIsModalActive, setRequestMessage }: IProps) => {
  const [formErrors, setFormErrors] = useState({} as IFormErrors);
  const [patchMethod, setPatchMethod] = useState(false);
  const tournamentNameRef = useRef<HTMLInputElement>(null);
  const tournamentCityRef = useRef<HTMLInputElement>(null);
  const tournamentStartDateNameRef = useRef<HTMLInputElement>(null);
  const tournamentEndDateRef = useRef<HTMLInputElement>(null);
  //
  return (
    <form className="form">
      <div className="form-row">
        <label htmlFor="tournamentName">Nom du tournoi</label>
        {formErrors.tournamentName && (
          <div className="form-error-detail">{formErrors.tournamentName}</div>
        )}
        <input
          type="text"
          id="tournamentName"
          className={formErrors.tournamentName ? "form-error" : ""}
          autoFocus
          // defaultValue={focusedRegistration?.tournamentName || undefined}
          ref={tournamentNameRef}
        />
      </div>
      <div className="form-row">
        <label htmlFor="tournamentCity">Ville du tournoi</label>
        {formErrors.tournamentCity && (
          <div className="form-error-detail">{formErrors.tournamentCity}</div>
        )}
        <input
          type="text"
          id="tournamentCity"
          className={formErrors.tournamentCity ? "form-error" : ""}
          ref={tournamentCityRef}
          // defaultValue={focusedRegistration?.tournamentCity || undefined}
          required
        />
      </div>
      <div className="form-row">
        {formErrors.tournamentStartDate && (
          <div className="form-error-detail">{formErrors.tournamentStartDate}</div>
        )}
        {formErrors.tournamentEndDate && (
          <div className="form-error-detail">{formErrors.tournamentEndDate}</div>
        )}
        <div className="dates">
          <label htmlFor="startDate">Du </label>
          <input
            type="date"
            id="startDate"
            ref={tournamentStartDateNameRef}
            min={formatDate(new Date().toISOString(), undefined, "XXXX-XX-XX")}
            // defaultValue={
            //   (focusedRegistration?.tournamentStartDate &&
            //     formatDate(focusedRegistration?.tournamentStartDate, undefined, "XXXX-XX-XX")) ||
            //   undefined
            // }
            required
          />
          <label htmlFor="endDate"> au </label>
          <input
            type="date"
            id="endDate"
            ref={tournamentEndDateRef}
            // min={
            //   tournamentStartDate.current?.value
            //     ? formatDate(
            //         new Date(
            //           new Date(registrationStartDate.current?.value!).setDate(
            //             new Date(registrationStartDate.current?.value!).getDate() + 1
            //           )
            //         ).toISOString(),
            //         undefined,
            //         "XXXX-XX-XX"
            //       )
            //     : undefined
            // }
            // defaultValue={
            //   (focusedRegistration?.tournamentEndDate &&
            //     formatDate(focusedRegistration?.tournamentEndDate, undefined, "XXXX-XX-XX")) ||
            //   undefined
            // }
          />
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="isTeamCompetition">Est-ce une compétition par équipe ?</label>
        <input type="checkbox" name="isTeamCompetition" id="isTeamCompetition" />
      </div>

      <div className="form-row">
        <div className="prices">
          <div className="prices-content">
            <div className="price">
              <label htmlFor="standardPrice1">Prix 1 tableau</label>
              <input type="number" name="standardPrice1" id="standardPrice1" />
            </div>
            <div className="price">
              <label htmlFor="standardPrice2">Prix 2 tableaux</label>
              <input type="number" name="standardPrice2" id="standardPrice2" />
            </div>
            <div className="price">
              <label htmlFor="standardPrice3">Prix 3 tableaux</label>
              <input type="number" name="standardPrice3" id="standardPrice3" />
            </div>
          </div>
          <div className="form-separator"></div>
          <div className="prices-content">
            <div className="price">
              <label htmlFor="standardPrice1">Prix élite 1 tableau</label>
              <input type="number" name="standardPrice1" id="standardPrice1" />
            </div>
            <div className="price">
              <label htmlFor="standardPrice2">Prix élite 2 tableaux</label>
              <input type="number" name="standardPrice2" id="standardPrice2" />
            </div>
            <div className="price">
              <label htmlFor="standardPrice3">Prix élite 3 tableaux</label>
              <input type="number" name="standardPrice3" id="standardPrice3" />
            </div>
          </div>
          <div className="form-separator"></div>
          <div className="prices-content">
            <div className="price">
              <label htmlFor="standardPrice1">Prix tableau simple</label>
              <input type="number" name="standardPrice1" id="standardPrice1" />
            </div>
            <div className="price">
              <label htmlFor="standardPrice2">Prix tableau double</label>
              <input type="number" name="standardPrice2" id="standardPrice2" />
            </div>
            <div className="price">
              <label htmlFor="standardPrice3">Prix tableau mixte</label>
              <input type="number" name="standardPrice3" id="standardPrice3" />
            </div>
          </div>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="registrationClosingDate">Date de limite d&apos;inscription</label>
        <input type="date" name="registrationClosingDate" id="registrationClosingDate" />
      </div>

      <div className="form-row">
        <label htmlFor="randomDrawDate">Date du Tirage au sort (TauS)</label>
        <input type="date" name="randomDrawDate" id="randomDrawDate" />
      </div>

      <div className="form-row">
        <label htmlFor="emailContact">Email de l&apos;organisateur</label>
        <input type="email" name="emailContact" id="emailContact" />
      </div>

      <div className="form-row">
        <label htmlFor="telContact">Téléphone de l&apos;organisateur</label>
        <input type="tel" name="telContact" id="telContact" pattern="0[0-9]{9}" min={10} max={12} />
      </div>

      <div className="form-row">
        <label htmlFor="registrationMethod">Méthode d&apos;inscription</label>
        <input
          type="text"
          name="registrationMethod"
          id="registrationMethod"
          list="registrationMethodList"
        />
        <datalist id="registrationMethodList">
          <option value="Badnet / eBad"></option>
          <option value="Email"></option>
          <option value="Courrier"></option>
          <option value="Site interne du club"></option>
        </datalist>
      </div>

      <div className="form-row">
        <label htmlFor="paymentMethod">Méthode d&apos;inscription</label>
        <input type="text" name="paymentMethod" id="paymentMethod" list="paymentMethodList" />
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
        <input type="file" name="file" id="file" />
      </div>

      <div className="form-row">
        <label htmlFor="comment">Commentaires</label>
        <textarea name="comment" id="comment"></textarea>
      </div>

      <input
        type="submit"
        value={(patchMethod ? "Modifier" : "Créer") + " le tournoi"}
        className="btn btn-primary"
      />
    </form>
  );
};

export default TournamentForm;
