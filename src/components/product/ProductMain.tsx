import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import { FaFilter } from "react-icons/fa";
import FilterDrawer from "./FilterDrawer";
import { RxAvatar } from "react-icons/rx";
import { ProductItem } from "./ProductItem";
import { Pagination } from "../util/Pagination"; // ensure this component exists
import { usePagination } from "../../hooks/paginationHook";

export interface IProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const ProductMain = () => {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const productIndexQuery = useQuery({
    queryKey: ["products", { page: 1 }],
    queryFn: productService.getProducts,
  });

  const {
    currentItems: currentProducts,
    totalPages,
    currentPage,
    paginate,
    setCurrentPage,
    perPage,
    setPerPage,
  } = usePagination(filteredProducts);

  useEffect(() => {
    if (productIndexQuery.isSuccess && productIndexQuery.data) {
      setAllProducts(productIndexQuery.data);
      applySearchFilter(productIndexQuery.data, searchQuery);
    }
  }, [productIndexQuery.isSuccess, productIndexQuery.data]);

  useEffect(() => {
    applySearchFilter(allProducts, searchQuery);
    setCurrentPage(1);
  }, [searchQuery, allProducts]);

  const applySearchFilter = (productsToFilter: IProduct[], query: string) => {
    if (!query) {
      setFilteredProducts(productsToFilter);
      return;
    }
    const lowercasedQuery = query.toLowerCase();
    const filtered = productsToFilter.filter(
      (product) =>
        product.title.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOverlayInteraction = (
    event: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (
      event.type === "click" ||
      (event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Escape")
    ) {
      setIsFilterDrawerOpen(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen relative bg-gray-100 p-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="w-[40%]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-md border border-gray-300 bg-white p-2 text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 text-black">
          <RxAvatar className="h-10 w-10 text-gray-700" />
          <div className="flex flex-col">
            <p className="font-semibold text-gray-800">John Doe</p>
            <p className="text-sm text-gray-600">john.doe@example.com</p>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mb-2 justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={paginate}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>

      {!isFilterDrawerOpen && (
        <button
          className="fixed bottom-8 right-8 z-50 transform rounded-full bg-blue-600 p-4 shadow-lg transition-colors duration-300 hover:scale-105 hover:bg-blue-700"
          onClick={() => setIsFilterDrawerOpen(true)}
          aria-label="Open filter drawer"
        >
          <FaFilter />
        </button>
      )}

      <FilterDrawer
        isFilterDrawerOpen={isFilterDrawerOpen}
        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
        products={allProducts}
        setDisplayedProducts={setFilteredProducts}
      />

      {isFilterDrawerOpen && (
        <button
          className="fixed inset-0 z-30 cursor-pointer border-none bg-black opacity-50"
          onClick={handleOverlayInteraction}
          onKeyDown={handleOverlayInteraction}
          aria-label="Close filter drawer"
          style={{ padding: 0, margin: 0 }}
        />
      )}

      <div
        className={`mt-4 grid gap-6 ${
          currentProducts.length > 0
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : ""
        } transition-all duration-300 ease-in-out`}
      >
        {productIndexQuery.isLoading && (
          <div className="col-span-full text-center text-lg text-gray-600">
            Loading products...
          </div>
        )}

        {productIndexQuery.isError && (
          <div className="col-span-full text-center text-lg text-red-600">
            Error loading products: {productIndexQuery.error.message}
          </div>
        )}

        {currentProducts.length > 0 && !productIndexQuery.isLoading
          ? currentProducts.map((product: IProduct) => (
              <ProductItem product={product} key={product.id} />
            ))
          : !productIndexQuery.isLoading &&
            !productIndexQuery.isError && (
              <div className="col-span-full text-center text-lg text-gray-600">
                No products found.
              </div>
            )}
      </div>
    </div>
  );
};
