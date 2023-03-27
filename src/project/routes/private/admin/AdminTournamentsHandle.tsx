import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ITournament } from "../../../../interfaces/interfaces";
import { sleep } from "../../../../utils/globals";
import useSWR from "swr";
import TournamentBand from "../../../features/tournaments/components/TournamentBand";
import { MouseEvent, useState } from "react";
import Modal from "../../../components/Modal";
import TournamentForm from "../../../features/tournaments/components/TournamentForm";

interface IProps {}

const AdminTournamentsHandle = ({}: IProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [selectedSeason, setSelectedSeason] = useState(
    Number(new Date().getMonth()) < 9
      ? `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`
      : `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
  );
  const [isModalActive, setIsModalActive] = useState(true);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });
  const [focusedTournament, setFocusedTournament] = useState({} as ITournament);
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

  const filterTournamentsBySeason = (array: Array<ITournament>, season: string) =>
    array.filter((tournament: ITournament) => tournament.season === season);

  const handleSeasonFilter = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // console.dir(e.target);

    setSelectedSeason((e.target as HTMLButtonElement).innerText);
  };

  return (
    <main className="admin-space">
      <h1>Gestion des tournois</h1>
      {tournamentsLoading ? (
        <p>Chargement des tournois</p>
      ) : (
        <>
          <div className="seasons-filter">
            {seasons
              .sort((a, b) => b.value.localeCompare(a.value))
              .map((item: { id: number; value: string }) => (
                <button
                  key={item.id}
                  onClick={handleSeasonFilter}
                  className={selectedSeason === item.value ? "selected" : undefined}
                >
                  {item.value}
                </button>
              ))}
          </div>
          <div className="tournaments-list">
            {filterTournamentsBySeason(tournaments, selectedSeason)
              .sort(
                (a: ITournament, b: ITournament) =>
                  Number(new Date(a.startDate)) - Number(new Date(b.startDate))
              )
              .map((tournament: ITournament) => (
                <TournamentBand key={tournament.id} tournament={tournament} />
              ))}
          </div>
        </>
      )}

      {isModalActive && (
        <Modal isModalActive={isModalActive} setIsModalActive={setIsModalActive}>
          <div className="modal-content modal-registration">
            <div className="title">
              <h2>Modification inscription :</h2>
            </div>

            <TournamentForm
              // patchMethod={patchMethod}
              setRequestMessage={setRequestMessage}
              focusedTournament={focusedTournament}
              isModalActive={isModalActive}
              setIsModalActive={setIsModalActive}
            />
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AdminTournamentsHandle;
