import { formatDate } from "../../config/functions";
import { ITournament, ITournamentRegistration } from "../../config/interfaces";

interface ITournamentProps {
  tournament: ITournament;
  onMobile: boolean;
}

const Tournament = ({ tournament, onMobile }: ITournamentProps) => {
  return onMobile ? (
    <div className="tournament card">
      <div className="name">{tournament.name}</div>
      <div className="city">{tournament.city}</div>
      <div className="dates">
        {formatDate(tournament.startDate, tournament.endDate, "XX & XX xxx XXXX")}
      </div>
      <div className="cta-container">
        <a href={tournament.regulationFileUrl} className="btn see-file">
          📄
        </a>
        <button className="btn register">➕</button>
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
      {/* <td>{tournament.tournamentRegistrations.map((elt: any) => elt.id)}</td> */}
      <td>
        {tournament.tournamentRegistrations.filter(
          (registration: ITournamentRegistration) =>
            registration.tournamentId === tournament.id && registration.requestState === "validated"
        ).length + 1}
      </td>
      <td>
        <div className="cta-container">
          <button>📄</button>
          <button>➕</button>
        </div>
      </td>
    </tr>
  );
};

export default Tournament;
