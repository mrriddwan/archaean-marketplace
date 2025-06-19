import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

export const Pagination = ({
  currentPage,
  totalPages,
  paginate,
  perPage,
  setPerPage,
}: {
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
  perPage: number;
  setPerPage: (value: number) => void;
}) => {
  const perPageOptions = [5, 10, 15, 20, 25];

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-y-3 sm:gap-y-0 sm:gap-x-6 text-sm">
      {/* Page Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md bg-gray-300 px-3 py-2 text-white hover:bg-gray-400 disabled:opacity-50"
        >
          <FaCircleChevronLeft />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`rounded-md px-3 py-2 transition ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-white hover:bg-gray-400"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md bg-gray-300 px-3 py-2 text-white hover:bg-gray-400 disabled:opacity-50"
        >
          <FaCircleChevronRight />
        </button>
      </div>

      {/* Per Page Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-gray-700">
          Show
        </label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-white text-black px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-gray-700">per page</span>
      </div>
    </div>
  );
};
