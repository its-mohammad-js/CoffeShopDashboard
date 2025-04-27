import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import Productinfo from "./pages/ProductInfo/Productinfo";
import EditAddProductForm from "./pages/EditAddProductForm/EditAddProductForm";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const ProductsDataContext = createContext();
export const useProductsData = () => useContext(ProductsDataContext);

function App() {
  const [{ loadig, products }, setProducts] = useState({
    loadig: false,
    products: [],
  });

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
    <ProductsDataContext.Provider value={{ products, loadig }}>
      <div className="mx-auto 2xl:max-w-[1280px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/MainForm/:id?" element={<EditAddProductForm />} />
        </Routes>
      </div>
    </ProductsDataContext.Provider>
  );
}

export default App;
