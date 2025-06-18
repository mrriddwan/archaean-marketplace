import type { IProduct } from "./ProductMain";

export const ProductItem = ({ product }: { product: IProduct }) => {
  return (
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
        <span className="mr-1">⭐ {product.rating.rate.toFixed(1)}</span>
        <span className="text-gray-500">({product.rating.count} reviews)</span>
      </div>
      {/* <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200">
                  View Details
                </button> */}
    </div>
  );
};
