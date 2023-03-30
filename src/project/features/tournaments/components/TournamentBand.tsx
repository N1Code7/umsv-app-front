import { MouseEvent, useEffect, useState } from "react";
import { ITournament } from "../../../../interfaces/interfaces";
import { formatDate } from "../../../../utils/dateFunctions";
import { mutate } from "swr";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import TournamentForm from "./TournamentForm";

interface IProps {
  tournament: ITournament;
}

const TournamentBand = ({ tournament }: IProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [isChevronDown, setIsChevronDown] = useState("down");

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!Array.from(document.querySelectorAll(".details a")).includes(e.target as Element)) {
      e.preventDefault();

      if (
        e.target !==
        document.querySelector(
          ".cta-container button, .registration-modalities a, .contacts a:nth-of-type(1), .contacts a:nth-of-type(2)"
        )
      ) {
        isChevronDown === "down" ? setIsChevronDown("up") : setIsChevronDown("down");
      }
    }
    e.stopPropagation();
  };

  const handleModify = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //
    await mutate(
      "tournaments",
      await axiosPrivate.patch(`/admin/tournament/${tournament.id}`, {}),
      {}
    );
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
            {tournament.regulationFileUrl ? (
              <a href={tournament.regulationFileUrl} target="_blank" rel="noopener noreferrer">
                Réglement particulier
              </a>
            ) : (
              <span>Pas de réglement</span>
            )}
          </li>
        </ul>
        <i className="fa-solid fa-address-card"></i>
        <ul className="contacts">
          <li>
            Email :{" "}
            {tournament.emailContact ? (
              <a href={`mailto:${tournament.emailContact}`}>{tournament.emailContact}</a>
            ) : (
              "-"
            )}
          </li>
          <li>
            Tél :{" "}
            {tournament.telContact ? (
              <a
                href={`tel:+33${
                  tournament.telContact[0] === "+"
                    ? tournament.telContact.slice(3)
                    : tournament.telContact.slice(1)
                }`}
              >
                {tournament.telContact}
              </a>
            ) : (
              "-"
            )}
          </li>
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
