import { type Dispatch, type SetStateAction } from "react";
import { FaFilterCircleXmark } from "react-icons/fa6";

export default function FilterDrawer({
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
}: {
  readonly isFilterDrawerOpen: boolean;
  readonly setIsFilterDrawerOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const categories = [
    "Electronics",
    "Jewelery", 
    "Men's Clothing",
    "Women's Clothing"
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-96 bg-white shadow-2xl z-40 transition-transform duration-300 ease-in-out p-6 overflow-y-auto
          ${isFilterDrawerOpen ? "translate-y-0" : "translate-y-full"}`}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-gray-500 hover:text-gray-700 p-1"
          onClick={() => setIsFilterDrawerOpen(false)}
          aria-label="Close filter drawer"
        >
          <FaFilterCircleXmark size={24} />
        </button>
      </div>

      {/* Mobile-optimized layout */}
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-8">
        
        {/* Price Range Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Price Range
          </h3>
          <input
            type="range"
            min="0"
            max="1000"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Category Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Category</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {categories.map((category) => (
              <label key={category} className="flex items-center text-gray-800 text-sm">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-blue-600 mr-2 h-4 w-4"
                  value={category.toLowerCase().replace(/['\s]/g, '-')}
                />
                <span className="truncate">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Sort By</h3>
          <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm">
            <option value="">Select option</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Apply/Reset Buttons - Mobile friendly */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
          Apply Filters
        </button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium">
          Reset
        </button>
      </div>
    </div>
  );
}