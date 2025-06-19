import { useState } from "react";
import type { IProduct } from "../components/product/ProductMain";

export const useProduct = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

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

  return {
    searchQuery,
    setSearchQuery,

    filteredProducts,
    setFilteredProducts,

    applySearchFilter,
    handleSearchChange,
  };
};
