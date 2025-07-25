import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useProductsData } from "../../App";
import { supabase } from "../../../supabaseClient";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { useState } from "react";

function ProductsList() {
  const { products, loading, deleteImage } = useProductsData();
  const navigate = useNavigate();
  const [selectedProduct, setSelected] = useState();

  async function onDeleteProduct(product) {
    try {
      if (!selectedProduct) {
        setSelected(product);
      } else {
        await deleteImage(selectedProduct.thumbnailSrc);

        await fetch("https://theorycafe.ir/wp-json/custom/v1/delete-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: selectedProduct.product_id }),
        });

        toast.success("Product Deleted Successfully");
        window.location.reload();
        console.log("Product and image deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  }

  function onEditProduct(product) {
    navigate(`/MainForm/${product.id}`);
  }

  if (!loading && products?.length)
    return (
      <>
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
                      onClick={() => setSelected(product)}
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

        <div
          className={`${
            selectedProduct ? "visible opacity-100" : "invisible opacity-0"
          } flex overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-950/50 backdrop-blur-sm z-50 justify-center items-center w-full md:inset-0 max-h-full`}
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                <button
                  type="button"
                  className="text-gray-400  bg-transparent text-3xl hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="default-modal"
                >
                  <CgClose />
                </button>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-800 md:text-xl font-semibold">
                  are you sure about delete this product ?
                </p>
              </div>

              <div className="flex items-center justify-end p-4 md:p-5 gap-2 rounded-b">
                <button
                  onClick={() => setSelected(null)}
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
                >
                  Cancel
                </button>
                <button
                  onClick={() => onDeleteProduct()}
                  type="button"
                  className="text-white bg-[#471b1f] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default ProductsList;
