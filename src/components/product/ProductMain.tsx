import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import { FaFilter } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { MdErrorOutline } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";
import { ProductItem } from "./ProductItem";
import FilterDrawer from "./FilterDrawer";
import { Pagination } from "../util/Pagination";
import { usePagination } from "../../hooks/paginationHook";
import { useUserContext } from "../../contexts/userContext";
import { useAuthHook } from "../../hooks/authHook";
import { FiLogOut } from "react-icons/fi";

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

  const { userContext } = useUserContext();

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

  const {logout} = useAuthHook()

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
    <div className="min-h-screen w-screen bg-gray-100 p-4 sm:p-10 relative">
      {/* Top Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-[40%] rounded-md border border-gray-300 bg-white p-2 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-3 text-black">
          <RxAvatar className="h-10 w-10 text-gray-700" />
          <div>
            <p className="font-semibold text-gray-800">{userContext.name}</p>
            <p className="text-sm text-gray-600">{userContext.email}</p>
          </div>

          <button
            onClick={() => logout() }
            className="rounded-md bg-gray-300 text-white hover:bg-gray-400 disabled:opacity-50"
          >
            <FiLogOut className="w-3 h-3"/>
          </button>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mb-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          paginate={paginate}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>

      {/* Filter Drawer Button */}
      {!isFilterDrawerOpen && (
        <button
          className="fixed bottom-8 right-8 z-50 rounded-full bg-blue-600 p-4 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
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
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={handleOverlayInteraction}
          onKeyDown={handleOverlayInteraction}
          aria-label="Close filter drawer"
          style={{ padding: 0, margin: 0 }}
        />
      )}

      {/* Product Grid */}
      <div
        className={`mt-4 grid gap-6 ${
          currentProducts.length > 0
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : ""
        }`}
      >
        {productIndexQuery.isLoading && (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 text-gray-600">
            <BiLoaderCircle className="animate-spin text-3xl text-blue-500" />
            <p className="text-lg font-medium">Loading products...</p>
          </div>
        )}

        {productIndexQuery.isError && (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 text-red-600">
            <MdErrorOutline className="text-3xl" />
            <p className="text-lg font-medium">
              Failed to load products. Please try again.
            </p>
          </div>
        )}

        {!productIndexQuery.isLoading &&
          !productIndexQuery.isError &&
          currentProducts.length > 0 &&
          currentProducts.map((product) => (
            <ProductItem product={product} key={product.id} />
          ))}

        {!productIndexQuery.isLoading &&
          !productIndexQuery.isError &&
          currentProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 text-gray-600">
              <MdErrorOutline className="text-3xl" />
              <p className="text-lg font-medium">No products found.</p>
            </div>
          )}
      </div>
    </div>
  );
};
