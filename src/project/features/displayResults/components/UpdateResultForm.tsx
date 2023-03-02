import { useState } from "react";
import { ITournamentRegistration } from "../../../../interfaces/interfaces";

interface IProps {
  focusedRegistration: ITournamentRegistration;
}

interface IFormErrors {}

const UpdateResultForm = ({ focusedRegistration }: IProps) => {
  const [formErrors, setFormErrors] = useState({} as IFormErrors);

  const resultRanks = [
    "Vainqueur",
    "Finaliste",
    "DQuart de finaliste",
    "Huitième de finaliste",
    "Seizième de finaliste",
    "Poule",
  ];

  return (
    <form className="form">
      <div className="form-row">
        <label htmlFor="tournament-name">Nom du tournoi</label>
        <p>{focusedRegistration.tournament?.name || focusedRegistration.tournamentName}</p>
      </div>
      {/* <h3>Résultats</h3> */}
      <div className="form-row">
        <label htmlFor="singleSelect">Simple</label>
        <select name="singleSelect" id="singleSelect">
          <option value="null">---</option>
          {resultRanks.map((rank: string, index: number) => (
            <option key={index}>{rank}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="doubleSelect">Double</label>
        <select name="doubleSelect" id="doubleSelect" placeholder="Double">
          <option value="null">---</option>
          {resultRanks.map((rank: string, index: number) => (
            <option key={index}>{rank}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="mixedSelect">Mixte</label>
        <select name="mixedSelect" id="mixedSelect">
          <option value="null">---</option>
          {resultRanks.map((rank: string, index: number) => (
            <option key={index}>{rank}</option>
          ))}
        </select>
      </div>
      {/* <div className="form-row select-ranks-container">
        <div className="select-rank">
          <label htmlFor="singleSelect">Simple</label>
          <select name="singleSelect" id="singleSelect">
            <option value="null">---</option>
            {resultRanks.map((rank: string, index: number) => (
              <option key={index}>{rank}</option>
            ))}
          </select>
        </div>
        <div className="select-rank">
          <label htmlFor="doubleSelect">Double</label>
          <select name="doubleSelect" id="doubleSelect">
            <option value="null">---</option>
            {resultRanks.map((rank: string, index: number) => (
              <option key={index}>{rank}</option>
            ))}
          </select>
        </div>
        <div className="select-rank">
          <label htmlFor="mixedSelect">Mixte</label>
          <select name="mixedSelect" id="mixedSelect">
            <option value="null">---</option>
            {resultRanks.map((rank: string, index: number) => (
              <option key={index}>{rank}</option>
            ))}
          </select>
        </div>
      </div> */}
      <div className="form-row">
        <label htmlFor="comment">Commentaire(s)</label>
        <textarea name="comment" id="comment"></textarea>
      </div>

      <input type="submit" value="Déclarer mon résultat" className="btn btn-primary" />
    </form>
  );
};

export default UpdateResultForm;
