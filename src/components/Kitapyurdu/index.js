import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";
import useFetchProducts from "../../useFetchProducts.js";

function Kitapyurdu({ searchText, sortOption }) {
  const { products, loading, error } = useFetchProducts(
    "kitapyurdu",
    searchText,
    sortOption
  );

  console.log("kitapyurdu.products : ", products);
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}

export default Kitapyurdu;
