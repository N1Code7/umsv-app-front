import { MouseEvent, useEffect, useState } from "react";
import { ITournament } from "../../../../interfaces/interfaces";
import { formatDate } from "../../../../utils/dateFunctions";

interface IProps {
  tournament: ITournament;
}

const TournamentBand = ({ tournament }: IProps) => {
  const [isChevronDown, setIsChevronDown] = useState("down");

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.preventDefault();
    if (e.target !== document.querySelector(".cta-container button"))
      isChevronDown === "down" ? setIsChevronDown("up") : setIsChevronDown("down");
    e.stopPropagation();
  };

  return (
    <div className="tournament band" onClick={handleClick}>
      <div className="abstract">
        <div className="tournament-date">
          {formatDate(
            tournament.startDate,
            tournament.endDate || undefined,
            tournament.endDate ? "interval" : "XX xxx XXXX"
          )}
        </div>
        <div className="tournament-name">{tournament.name}</div>
        <div className="tournament-city">{tournament.city}</div>
      </div>
      <div
        className="details"
        style={
          isChevronDown === "down"
            ? { maxHeight: 0, opacity: 0, margin: 0, zIndex: "-1" }
            : { maxHeight: 500, opacity: 1, marginTop: "0.5rem", marginBottom: "0.5rem", zIndex: 0 }
        }
      >
        <i className="fa-solid fa-euro-sign"></i>
        <div className="prices">
          <div className="prices-standard">
            Standard : {tournament.standardPrice1 + " €"} - {tournament.standardPrice2 + " €"}{" "}
            {tournament.standardPrice3 ? "- " + tournament.standardPrice3 + " €" : ""}
          </div>
          {tournament.elitePrice1 && (
            <div className="prices-elite">
              Élite :{" "}
              {tournament.elitePrice1 +
                " € - " +
                tournament.elitePrice2 +
                " € - " +
                tournament.elitePrice3 +
                " €"}
            </div>
          )}

          {(tournament.priceSingle || tournament.priceDouble || tournament.priceMixed) && (
            <div className="prices-per-schedule">
              Simple : {tournament.priceSingle} - Double : {tournament.priceDouble} - Mixte :{" "}
              {tournament.priceMixed}
            </div>
          )}
        </div>
        <i className="fa-solid fa-clipboard-list"></i>
        <ul className="registration-modalities">
          <li>Mode d&apos;inscription : {tournament.registrationMethod}</li>
          <li>Paiement : {tournament.paymentMethod}</li>
          <li>Limite d&apos;inscription : {formatDate(tournament.registrationClosingDate)}</li>
          <li>Tirage au sort : {formatDate(tournament.randomDraw)}</li>
          <li>
            <a href={tournament.regulationFileUrl}>Règlement particulier</a>
          </li>
        </ul>
        <i className="fa-solid fa-address-card"></i>
        <ul className="contacts">
          <li>Email : {tournament.emailContact}</li>
          <li>Tél : {tournament.telContact}</li>
        </ul>
        <i className="fa-solid fa-comment-dots"></i>
        <div className="comment">{tournament.comment || "Aucun commentaire"}</div>
      </div>
      <div className="cta-container">
        <button className="btn btn-modify">✏️</button>
        <button className="btn btn-delete">🗑️</button>
      </div>

      <button onClick={handleClick}>
        <i className={`fa-solid fa-chevron-${isChevronDown}`}></i>
      </button>
    </div>
  );
};

export default TournamentBand;
