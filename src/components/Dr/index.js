import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";
import useFetchProducts from "../../useFetchProducts";

export default function Dr({ searchText, sortOption }) {
  const { products, loading, error } = useFetchProducts(
    "dr",
    searchText,
    sortOption
  );

  console.log("dr.products : ", products);
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}
