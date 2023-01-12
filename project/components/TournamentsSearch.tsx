import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState } from "react";

interface IProps {
  searchByText: string;
  setSearchByText: Dispatch<SetStateAction<string>>;
  searchByDay: string;
  setSearchByDay: Dispatch<SetStateAction<string>>;
  searchByMonth: string;
  setSearchByMonth: Dispatch<SetStateAction<string>>;
  searchByYear: string;
  setSearchByYear: Dispatch<SetStateAction<string>>;
}

const TournamentsSearch = ({
  searchByText,
  setSearchByText,
  searchByDay,
  setSearchByDay,
  searchByMonth,
  setSearchByMonth,
  searchByYear,
  setSearchByYear,
}: IProps) => {
  const daysNumber = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];
  const monthsNumber = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const [displaySearch, setDisplaySearch] = useState(false);

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchByText("");
    setSearchByDay("default");
    setSearchByMonth("default");
    setSearchByYear("default");
  };

  return (
    <div className={displaySearch ? "search-container active" : "search-container"}>
      <button id="searchMobileBtn" onClick={() => setDisplaySearch(!displaySearch)}>
        Rechercher un tournoi 🔎
      </button>
      <h3>Rechercher un tournoi 🔎</h3>
      <form>
        <div className="form-control">
          <div className="form-row">
            <input
              type="text"
              placeholder="nom ou ville"
              value={searchByText}
              defaultValue=""
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchByText(e.target.value)}
            />
          </div>
          <span>ou</span>
          <div className="form-row">
            {/* Day search */}
            <select
              id="daySelected"
              defaultValue="default"
              value={searchByDay}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSearchByDay(e.target.value)}
            >
              <option value="default">--</option>
              {daysNumber.map((day: string, index: number) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {/* Month search */}
            <select
              id="monthSelected"
              value={searchByMonth}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSearchByMonth(e.target.value)}
            >
              <option value="default">------</option>
              {monthsNumber.map((month: string, index: number) => (
                <option key={index} value={month.toLowerCase()}>
                  {month}
                </option>
              ))}
            </select>
            {/* Year search */}
            <select
              id="yearSelected"
              value={searchByYear}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSearchByYear(e.target.value)}
            >
              <option value="default">----</option>
              {[new Date().getFullYear(), new Date().getFullYear() + 1].map(
                (year: number, index: number) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <button className="btn btn-secondary btn-small" id="resetBtn" onClick={handleReset}>
          Réinitialiser les filtres
        </button>
      </form>
    </div>
  );
};

export default TournamentsSearch;
