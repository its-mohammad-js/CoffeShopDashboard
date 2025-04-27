import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useProductsData } from "../../App";

function ProductsList() {
  const { products, loading } = useProductsData();
  const navigate = useNavigate();

  function onDeleteProduct(id) {
    console.log(id);
  }

  console.log(products);

  function onEditProduct(product) {
    navigate(`/MainForm/${product.id}`);
  }

  if (!loading && products?.length)
    return (
      <div>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers also purchased
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <button
                    onClick={() => onDeleteProduct(product?.id)}
                    className="absolute cursor-pointer z-10 bg-gray-200 text-red-400 text-2xl p-2 rounded-full top-2 right-2"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => onEditProduct(product)}
                    className="absolute cursor-pointer z-10 bg-gray-200 text-gray-800 text-2xl p-2 rounded-full top-2 left-2"
                  >
                    <FaPencil />
                  </button>
                  <img
                    alt={"product thumbnail"}
                    src={product.thumbnailSrc}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-700">
                        {product?.name__en}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product?.category__en}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {product?.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}

export default ProductsList;
