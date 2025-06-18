import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { FaFilterCircleXmark } from "react-icons/fa6";
import type { IProduct } from "./ProductMain";

export default function FilterDrawer({
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  products,
  setDisplayedProducts,
}: {
  readonly isFilterDrawerOpen: boolean;
  readonly setIsFilterDrawerOpen: Dispatch<SetStateAction<boolean>>;
  readonly products: IProduct[];
  readonly setDisplayedProducts: Dispatch<SetStateAction<IProduct[]>>;
}) {
  const categories = useMemo(() => {
    const categorySet = new Set(products.map((p) => p.category));
    return Array.from(categorySet);
  }, [products]);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("");

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
    }
  };

  const handleApplyFilters = () => {
    let filteredAndSortedProducts = [...products];

    filteredAndSortedProducts = filteredAndSortedProducts.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    if (selectedCategories.length > 0) {
      filteredAndSortedProducts = filteredAndSortedProducts.filter((product) =>
        selectedCategories.includes(
          product.category.toLowerCase().replace(/['\s]/g, "-")
        )
      );
    }

    filteredAndSortedProducts.sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating-asc":
          return a.rating.rate - b.rating.rate;
        case "rating-desc":
          return b.rating.rate - a.rating.rate;
        default:
          return 0;
      }
    });

    setDisplayedProducts(filteredAndSortedProducts);
    setIsFilterDrawerOpen(false);
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(1000);
    setSelectedCategories([]);
    setSortOption("");
    setDisplayedProducts(products);
    setIsFilterDrawerOpen(false);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 h-96 overflow-y-auto rounded-t-lg bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
        isFilterDrawerOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mb-6 flex items-center justify-end">
        <button
          className="p-1 text-gray-500 hover:text-gray-700"
          onClick={() => setIsFilterDrawerOpen(false)}
          aria-label="Close filter drawer"
        >
          <FaFilterCircleXmark size={24} />
        </button>
      </div>

      <div className="flex flex-col space-y-6 md:flex-row md:space-x-8 md:space-y-0">
        <div className="flex w-full flex-col md:flex-row md:space-x-8">
          {/* Price Range Section */}
          <div className="w-full px-5">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Price Range
            </h3>
            <input
              type="range"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="h-2 w-full appearance-none cursor-pointer rounded-lg bg-gray-200"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>$0</span>
              <span>${maxPrice}</span>
            </div>
          </div>
          {/* Sort Section */}
          <div className="w-full px-5">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Sort By
            </h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select option</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Section */}
        <div className="flex-1 px-5">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Category</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center text-sm text-gray-800"
              >
                <input
                  type="checkbox"
                  className="form-checkbox mr-2 h-4 w-4 text-blue-600"
                  value={category.toLowerCase().replace(/['\s]/g, "-")}
                  checked={selectedCategories.includes(
                    category.toLowerCase().replace(/['\s]/g, "-")
                  )}
                  onChange={handleCategoryChange}
                />
                <span className="truncate">{category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3 border-t border-gray-200 pt-4">
        <button
          onClick={handleApplyFilters}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
