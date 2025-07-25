import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import EditAddProductForm from "./pages/EditAddProductForm/EditAddProductForm";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Toaster } from "react-hot-toast";

const ProductsDataContext = createContext();
export const useProductsData = () => useContext(ProductsDataContext);

function App() {
  const [{ loadig, products }, setProducts] = useState({
    loadig: false,
    products: [],
  });

  const deleteImage = async (imageUrl) => {
    try {
      if (!imageUrl) {
        throw new Error("No image URL provided");
      }

      // get attachment id
      const attachmentRes = await fetch(
        "https://theorycafe.ir/wp-json/custom/v1/get-attachment-id",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
          }),
        }
      );

      const attachmentData = await attachmentRes.json();
      const attachmentId = attachmentData.attachmentId;

      if (!attachmentId) {
        throw new Error("Attachment ID not found");
      }

      // delete image
      const deleteRes = await fetch(
        `https://theorycafe.ir/wp-json/custom/v1/delete-image?attachmentId=${attachmentId}`,
        {
          method: "DELETE",
        }
      );

      const deleteResult = await deleteRes.json();

      if (!deleteRes.ok || !deleteResult.success) {
        throw new Error(deleteResult.error || "Image deletion failed");
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting image:", error.message);
      return { error: error.message };
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setProducts({ loadig: true, products: [] });

      const res = await fetch(
        "https://theorycafe.ir/wp-json/custom/v1/get-products"
      );
      const productsList = await res.json();

      setProducts({
        loadig: false,
        products: productsList,
      });
    };

    getProducts();
  }, []);

  return (
    <ProductsDataContext.Provider value={{ products, loadig, deleteImage }}>
      <Toaster />
      <div className="mx-auto 2xl:max-w-[1280px] relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/MainForm/:id?" element={<EditAddProductForm />} />
        </Routes>
      </div>
    </ProductsDataContext.Provider>
  );
}

export default App;
