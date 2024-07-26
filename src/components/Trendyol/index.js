import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";
import useFetchProducts from "../../useFetchProducts";

const URL = "http://localhost:5000/api/fetch/trendyol";
const storeBaseUrl = "https://www.trendyol.com";

export default function SearchResults({ searchText, sortOption }) {
  const { products, loading, error } = useFetchProducts(
    "trendyol",
    searchText,
    sortOption
  );

  console.log("trendyol.products : ", products);
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}
