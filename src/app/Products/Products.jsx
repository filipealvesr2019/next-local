import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

import CreateProductsModal from "../components/CreateProducts/CreateProductsModal/CreateProductsModal";
import Link from "next/link";
import { useConfig } from "../../../context/ConfigContext";
export default function Products() {
  const AdminID = Cookies.get("AdminID"); // Obtenha o ID do cliente do cookie

  const { apiUrl } = useConfig();
  const [data, setData] = useState([]);

  // console.log("adminEccommerceID", adminEccommerceID)
  async function getProducts() {
    try {
      const response = await axios.get(`${apiUrl}/api/products/${AdminID}`);
      setData(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column"
     
         // Habilita a rolagem apenas dentro dessa área
       
        }}
      >
        <div
          style={{
            marginTop: "10rem",
            
          }}
        >
          <CreateProductsModal />
        </div>
        {data.length > 0 ? (
          data.map((product) => (
            <Link href={`/user/product/${product._id}`}>
              <div key={product._id} style={{ marginTop: "10rem",  }}>
                {product.name}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "15vw" }}
                />
              </div>
            </Link>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </>
  );
}
