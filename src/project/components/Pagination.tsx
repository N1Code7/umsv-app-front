import { MouseEventHandler } from "react";
import { DOTS, usePagination } from "../../config/usePagination";

interface IPagination {
  currentPage: number;
  totalCount: number;
  siblingCount: number;
  pageSize: number;
  onPageChange: (arg0: number) => MouseEventHandler<HTMLLIElement>;
}

const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  siblingCount = 1,
  onPageChange,
}: IPagination) => {
  const paginationRange = usePagination({ currentPage, totalCount, siblingCount, pageSize });

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) return null;

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  let lastPage = paginationRange?.[paginationRange?.length - 1];

  return (
    <ul>
      <li>Previous</li>
      {paginationRange?.map((pageNumber: any, index: number) => {
        if (pageNumber === DOTS) {
          return <li key={index}>&#8230;</li>;
        }
        return (
          <li key={index} onClick={onPageChange(pageNumber)}>
            {pageNumber}
          </li>
        );
      })}
      <li>Next</li>
    </ul>
  );
};

export default Pagination;
