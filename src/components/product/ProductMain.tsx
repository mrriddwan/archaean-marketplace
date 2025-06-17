import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import { FaFilter } from "react-icons/fa";
import FilterDrawer from "./FilterDrawer";

interface IProduct {
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
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // index type
  const productIndexQuery = useQuery({
    queryKey: [
      "products",
      {
        page: 1,
        per_page: 2,
      },
    ],
    queryFn: productService.getProducts,
    // enabled: Boolean(user && type),
  });

  useEffect(() => {
    if (productIndexQuery.isSuccess) {
      setProducts(productIndexQuery.data);
    }
  }, [productIndexQuery.isSuccess, productIndexQuery.data]);

  // Handle overlay click and keyboard events
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
    <div className="min-h-screen min-w-screen bg-gray-100 p-10 relative">
      {/* Search bar */}
      <div className="mb-8 w-[40%]">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black"
        />
      </div>

      {/* Floating Filter Button */}
      {!isFilterDrawerOpen && (
        <button
          className="fixed top-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
          onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          aria-label="Open filter drawer"
        >
          <FaFilter />
        </button>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isFilterDrawerOpen={isFilterDrawerOpen}
        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
      />

      {/* Overlay */}
      {isFilterDrawerOpen && (
        <button
          className="fixed inset-0 bg-black opacity-50 z-30 cursor-pointer border-none"
          onClick={handleOverlayInteraction}
          onKeyDown={handleOverlayInteraction}
          aria-label="Close filter drawer"
          style={{ padding: 0, margin: 0 }}
        />
      )}

      {/* Product Display */}
      <div
        className={`grid gap-6 mt-4 "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        } transition-all duration-300 ease-in-out`}
      >
        {productIndexQuery.isLoading && (
          <div className="col-span-full text-center text-gray-600 text-lg">
            Loading products...
          </div>
        )}

        {productIndexQuery.isError && (
          <div className="col-span-full text-center text-red-600 text-lg">
            Error loading products: {productIndexQuery.error.message}
          </div>
        )}

        {products.length > 0
          ? products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-32 h-32 object-contain mb-4 rounded-md"
                />
                <h3 className="text-md font-semibold mb-2 text-gray-800 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xl font-bold text-blue-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="mr-1">
                    ⭐ {product.rating.rate.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({product.rating.count} reviews)
                  </span>
                </div>
                <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200">
                  View Details
                </button>
              </div>
            ))
          : !productIndexQuery.isLoading &&
            !productIndexQuery.isError && (
              <div className="col-span-full text-center text-gray-600 text-lg">
                No products found.
              </div>
            )}
      </div>
    </div>
  );
};
