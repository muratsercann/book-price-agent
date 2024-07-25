import { useState, useEffect } from "react";
import * as utils from "./utils";

const useFetchProducts = (store, searchText, sortOption) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKitapyurdu = async () => {
      return utils.getKitapYurduProducts(searchText, sortOption);
    };
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchKitapyurdu();
        console.log("response : ", response);
        if (response.ok) {
          setProducts(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError("Bir hata oluştu");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchText, sortOption]);

  return { products, loading, error };
};

export default useFetchProducts;
