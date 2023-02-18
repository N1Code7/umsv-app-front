import { EventHandler, MouseEvent, useContext } from "react";
import { formatDate } from "../../utils/functions/dateFunctions";
import { ITournament, ITournamentRegistration } from "../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { SelectedTournamentContext } from "../../contexts/SelectedTournamentContext";

interface ITournamentProps {
  tournament: ITournament;
  displayOnMobile: boolean;
}

const Tournament = ({ tournament, displayOnMobile }: ITournamentProps) => {
  const navigate = useNavigate();
  const { setSelectedTournament } = useContext(SelectedTournamentContext);

  const handleRegister = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedTournament?.(tournament);
    navigate("/nouvelle_inscription", { replace: true });
  };

  return displayOnMobile ? (
    <div className="tournament card">
      <div className="name">{tournament.name}</div>
      <div className="city">{tournament.city}</div>
      <div className="dates">
        {formatDate(tournament.startDate, tournament.endDate, "XX & XX xxx XXXX")}
      </div>
      <div className="cta-container">
        <a
          // HAVE TO CHANGE URL !!!!!!
          href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
          className="btn see-file"
          target="_blank"
          rel="noopener noreferrer"
        >
          📄
        </a>
        <button className="btn register" onClick={handleRegister}>
          ➕
        </button>
      </div>
    </div>
  ) : (
    <tr className="tournament">
      <td>{formatDate(tournament.startDate, tournament.endDate, "XX & XX xxx XXXX")}</td>
      <td>{tournament.name}</td>
      <td>{tournament.city}</td>
      <td>
        {new Date(tournament.registrationClosingDate).getTime() - new Date().getTime() < 0
          ? "🙅"
          : formatDate(tournament.registrationClosingDate, "XX/XX/XX")}
      </td>
      <td>
        {new Date(tournament.randomDraw).getTime() - new Date().getTime() < 0
          ? "🙅"
          : formatDate(tournament.randomDraw, "XX/XX/XX")}
      </td>
      <td>
        {
          tournament.tournamentRegistrations.filter(
            (registration: ITournamentRegistration) =>
              // registration.tournamentId === tournament.id &&
              registration.requestState === "validated"
          ).length
        }
      </td>
      <td>
        <div className="cta-container">
          <a
            // HAVE TO CHANGE URL !!!!!!
            href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
            className="btn see-file"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄
          </a>
          <button className="btn register" onClick={handleRegister}>
            ➕
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Tournament;
