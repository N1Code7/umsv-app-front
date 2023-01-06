import { ITournament } from "../../config/interfaces";

interface ITournamentProps {
  tournament: ITournament;
}

const Tournament = ({ tournament }: ITournamentProps) => {
  return (
    <tr>
      <td>{tournament.name}</td>
      <td>{tournament.city}</td>
      <td>{tournament.startDate}</td>
      <td>{tournament.registrationClosingDate}</td>
      <td>{tournament.randomDraw}</td>
      <td>?</td>
      <td>Actions</td>
    </tr>
  );
};

export default Tournament;
