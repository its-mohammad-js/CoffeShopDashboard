import ProductsList from "./ProductsList";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* hero section */}
      <div className="bg-[#8d2f2d] w-full h-64 rounded-b-lg text-gray-100 flex flex-col items-center justify-evenly text-4xl font-bold">
        <h4>Coffe Theory</h4>

        <button
          onClick={() => navigate("/MainForm/")}
          className="bg-gray-200 px-2 py-1 text-[#8d2f2d] text-base cursor-pointer rounded-md"
        >
          Add New Product
        </button>
      </div>

      <ProductsList />
    </div>
  );
}

export default HomePage;
