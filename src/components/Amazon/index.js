import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";
import useFetchProducts from "../../useFetchProducts";

export default function Amazon({ searchText }) {
  const { products, loading, error } = useFetchProducts(
    "amazon",
    searchText,
    ""
  );

  console.log("amazon.products : ", products);
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}
