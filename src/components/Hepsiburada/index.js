import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";
import useFetchProducts from "../../useFetchProducts";

const URL = "http://localhost:5000/api/fetch/hepsiburada";
const storeBaseUrl = "https://www.hepsiburada.com";
export default function Hepsiburada({ searchText, sortOption }) {
  const { products, loading, error } = useFetchProducts(
    "hepsiburada",
    searchText,
    sortOption
  );

  console.log("hepsiburada.products : ", products);
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}
