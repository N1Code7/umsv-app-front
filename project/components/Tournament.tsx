import { formatDate } from "../../config/functions";
import { ITournament, ITournamentRegistration } from "../../config/interfaces";

interface ITournamentProps {
  tournament: ITournament;
}

const Tournament = ({ tournament }: ITournamentProps) => {
  return (
    <tr>
      <td>{tournament.name}</td>
      <td>{tournament.city}</td>
      <td>{formatDate(tournament.startDate, tournament.endDate, "XX & XX xxx XXXX")}</td>
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
        <button>📄</button>
        <button>➕</button>
      </td>
    </tr>
  );
};

export default Tournament;
