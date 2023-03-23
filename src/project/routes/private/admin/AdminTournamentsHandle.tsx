import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ITournament } from "../../../../interfaces/interfaces";
import { sleep } from "../../../../utils/globals";
import useSWR from "swr";
import TournamentBand from "../../../features/tournaments/components/TournamentBand";

interface IProps {}

const AdminTournamentsHandle = ({}: IProps) => {
  const axiosPrivate = useAxiosPrivate();
  //
  const fetcher = async (url: string) =>
    sleep(2000)
      .then(() => axiosPrivate.get(url))
      .then((res) => res.data)
      .catch((err) => console.error(err));
  const { data: tournaments, isLoading: tournamentsLoading } = useSWR("/tournaments", fetcher);

  const seasons = [
    { id: 1, value: "2019/2020" },
    { id: 2, value: "2020/2021" },
    { id: 3, value: "2021/2022" },
    { id: 4, value: "2022/2023" },
  ];

  return (
    <main className="admin-space">
      <h1>Gestion des tournois</h1>
      {tournamentsLoading ? (
        <p>Chargement des tournois</p>
      ) : (
        <>
          <div className="seasons-filter">
            {seasons.map((item: { id: number; value: string }) => (
              <span key={item.id}>{item.value}</span>
            ))}
          </div>
          <div className="tournaments-list">
            {tournaments.map((tournament: ITournament) => (
              <TournamentBand key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default AdminTournamentsHandle;
