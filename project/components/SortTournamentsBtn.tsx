import { Dispatch, MouseEvent, SetStateAction } from "react";

interface ISortBtnProps {
  property: string;
  activeSort: string;
  setActiveSort: Dispatch<SetStateAction<string>>;
}

const SortTournamentsBtn = ({ property, activeSort, setActiveSort }: ISortBtnProps) => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).tagName === "I"
      ? setActiveSort?.((e.target as HTMLElement).parentElement!.dataset.sort!)
      : setActiveSort?.((e.target as HTMLElement).dataset.sort!);
  };

  return (
    <div className="sort-btn-container">
      <button
        className={
          activeSort === `${property}-ascending` ? "btn btn-small active" : "btn btn-small"
        }
        data-sort={`${property}-ascending`}
        onClick={handleClick}
      >
        <i className="fa-solid fa-arrow-up-wide-short"></i>
      </button>
      <button
        className={
          activeSort === `${property}-descending` ? "btn btn-small active" : "btn btn-small"
        }
        data-sort={`${property}-descending`}
        onClick={handleClick}
      >
        <i className="fa-solid fa-arrow-up-short-wide"></i>
      </button>
    </div>
  );
};
export default SortTournamentsBtn;
