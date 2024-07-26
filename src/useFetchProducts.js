import { useState, useEffect } from "react";
import * as utils from "./utils";

const useFetchProducts = (store, searchText, sortOption) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await (async () => {
          switch (store) {
            case "kitapyurdu":
              return await utils.getKitapYurduProducts(searchText, sortOption);
            case "amazon":
              return await utils.getAmazonProducts(searchText);
            case "dr":
              return await utils.getDrproducts(searchText, sortOption);
            case "trendyol":
              return await utils.getTrendyolProducts(searchText, sortOption);
            case "hepsiburada":
              return await utils.getHepsiburadaProducts(searchText, sortOption);
            default:
              break;
          }
        })();

        console.log(store + "_response : ", response);
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
  }, [searchText, sortOption, store]);

  return { products, loading, error };
};

export default useFetchProducts;
