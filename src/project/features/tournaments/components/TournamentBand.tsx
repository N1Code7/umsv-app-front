import { ITournament } from "../../../../interfaces/interfaces";
import { formatDate } from "../../../../utils/dateFunctions";

interface IProps {
  tournament: ITournament;
}

const TournamentBand = ({ tournament }: IProps) => {
  return (
    <div className="tournament band">
      <div className="tournament-name">{tournament.name}</div>
      <div className="tournament-city">{tournament.city}</div>
      <div className="tournamnet-date">
        {}
        {formatDate(
          tournament.startDate,
          tournament.endDate || undefined,
          tournament.endDate ? "interval" : "XX xxx XXXX"
        )}
      </div>
      <div className="cta-container">
        <button className="btn btn-modify">✏️</button>
        <button className="btn btn-delete">🗑️</button>
      </div>
    </div>
  );
};

export default TournamentBand;
