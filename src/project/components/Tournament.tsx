import { EventHandler, MouseEvent, useContext } from "react";
import { formatDate } from "../../utils/dateFunctions";
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
        {formatDate(String(tournament.startDate), String(tournament.endDate), "XX & XX xxx XXXX")}
      </div>
      <div className="cta-container">
        <a
          // HAVE TO CHANGE URL !!!!!!
          href="https://www.lifb.org/wp-content/uploads/2022/09/OPS_Reglement_Autorisations_Tournois_2022-2023_NVF-1.pdf"
          className="btn btn-see-file"
          target="_blank"
          rel="noopener noreferrer"
        >
          📄
        </a>
        <button className="btn btn-success" onClick={handleRegister}>
          ➕
        </button>
      </div>
    </div>
  ) : (
    <tr className="tournament">
      <td>
        {formatDate(String(tournament.startDate), String(tournament.endDate), "XX & XX xxx XXXX")}
      </td>
      <td>{tournament.name}</td>
      <td>{tournament.city}</td>
      <td>
        {new Date(tournament.registrationClosingDate || 0).getTime() - new Date().getTime() < 0
          ? "🙅"
          : formatDate(String(tournament.registrationClosingDate), "XX/XX/XX")}
      </td>
      <td>
        {new Date(tournament.randomDraw || 0).getTime() - new Date().getTime() < 0
          ? "🙅"
          : formatDate(String(tournament.randomDraw), "XX/XX/XX")}
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
            className="btn btn-see-file"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄
          </a>
          <button className="btn btn-success" onClick={handleRegister}>
            ➕
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Tournament;
