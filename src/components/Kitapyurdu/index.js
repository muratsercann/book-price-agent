import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";
import * as utils from "../../utils.js";
const URL = "http://localhost:5000/api/fetch/kitapyurdu";

function Kitapyurdu({ searchText, sortOption }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const response = await utils.getKitapYurduProducts(
        searchText,
        sortOption
      );
      console.log("response : ", response);
      setLoading(false);
      if (response.ok) {
        setProducts(response.data);
      } else {
        setError(response.error);
      }
    };
    fetch();
  }, [searchText, sortOption]);

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}

export default Kitapyurdu;
