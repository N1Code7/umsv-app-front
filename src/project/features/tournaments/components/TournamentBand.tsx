import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { ITournament } from "../../../../interfaces/interfaces";
import { formatDate } from "../../../../utils/dateFunctions";
import { mutate } from "swr";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

interface IProps {
  tournament: ITournament;
  setPatchMethod: Dispatch<SetStateAction<boolean>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setFocusedTournament: Dispatch<SetStateAction<ITournament>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

const TournamentBand = ({
  tournament,
  setPatchMethod,
  setIsModalActive,
  setFocusedTournament,
  setRequestMessage,
}: IProps) => {
  //
  const axiosPrivate = useAxiosPrivate();
  const [isChevronDown, setIsChevronDown] = useState("down");

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!Array.from(document.querySelectorAll(".details a")).includes(e.target as Element)) {
      e.preventDefault();

      if (
        !Array.from(
          document.querySelectorAll(
            ".cta-container button, .registration-modalities a, .contacts a:nth-of-type(1), .contacts a:nth-of-type(2)"
          )
        ).includes(e.target as Element)
      ) {
        isChevronDown === "down" ? setIsChevronDown("up") : setIsChevronDown("down");
      }
    }
    e.stopPropagation();
  };

  const handleModify = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPatchMethod?.(true);
    setFocusedTournament?.(tournament);
    setIsModalActive?.(true);
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //
    await mutate("/tournaments", axiosPrivate.delete(`/admin/tournament/${tournament.id}`), {
      optimisticData: (all: Array<ITournament>) =>
        all
          .filter((tou: ITournament) => tou.id !== tournament.id)
          .sort(
            (a: ITournament, b: ITournament) =>
              Number(new Date(a.startDate)) - Number(new Date(b.startDate))
          ),
      populateCache: (result, current: Array<ITournament>) =>
        current.filter((tou: ITournament) => tou.id !== tournament.id),
      revalidate: false,
      rollbackOnError: true,
    })
      .then(() => {
        setRequestMessage({ success: "Le tournoi a bien été supprimé ! 👌", error: "" });
      })
      .catch((err) => {
        console.error(err);
        setRequestMessage({
          success: "",
          error: "Une erreur est survenue lors de la suppression du tournoi ! 🤕",
        });
      });

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
    window.scrollTo(0, 0);
  };

  return (
    <div className="tournament band" onClick={handleClick}>
      <div className="abstract">
        <div className="tournament-date">
          {formatDate(
            String(tournament.startDate),
            String(tournament.endDate) || undefined,
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
          <li>
            Limite d&apos;inscription : {formatDate(String(tournament.registrationClosingDate))}
          </li>
          <li>Tirage au sort : {formatDate(String(tournament.randomDraw))}</li>
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
                {[
                  tournament.telContact.slice(0, 2),
                  tournament.telContact.slice(2, 4),
                  tournament.telContact.slice(4, 6),
                  tournament.telContact.slice(6, 8),
                  tournament.telContact.slice(8, 10),
                ].join(" ")}
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
        <button className="btn btn-modify" onClick={handleModify}>
          ✏️
        </button>
        <button className="btn btn-delete" onClick={handleDelete}>
          🗑️
        </button>
      </div>

      <button onClick={handleClick}>
        <i className={`fa-solid fa-chevron-${isChevronDown}`}></i>
      </button>
    </div>
  );
};

export default TournamentBand;
