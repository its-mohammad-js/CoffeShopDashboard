import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import ProductsList from "./ProductsList";

function HomePage() {
  return (
    <div>
      {/* hero section */}
      <div className="bg-[#8d2f2d] w-full h-64 rounded-b-lg text-gray-100 flex items-center justify-center text-4xl font-bold">
        <h4>Coffe Theory</h4>
      </div>

      <ProductsList />
    </div>
  );
}

export default HomePage;
