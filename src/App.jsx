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

      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts.slice(6).join("/");

      const res = await supabase.storage
        .from("productimages")
        .remove([filePath]);

      return { success: true };
    } catch (error) {
      console.error("Error deleting image:", error.message);
      return { error };
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setProducts({ loadig: true, products: [] });

      let { data: Products, error } = await supabase
        .from("Products")
        .select("*");

      setProducts({
        loadig: false,
        products: Products,
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
