import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";

const URL = "http://localhost:5000/api/fetch/kitapyurdu";

function Kitapyurdu({ searchText, sortOption }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const searchUrl = `${URL}?query=${encodeURIComponent(
          searchText
        )}&sortOption=${encodeURIComponent(sortOption)}`;
        const response = await fetch(searchUrl);
        const data = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");

        const productTableDiv = doc.querySelector("#product-table");

        if (!productTableDiv) {
          setProducts([]);
          console.log("No Product found !");
          setLoading(false);
          return;
        }

        const results = [];
        // İçerideki product-cr öğelerini seçin
        productTableDiv.querySelectorAll(".product-cr").forEach((el) => {
          const title =
            el.querySelector(".name span")?.textContent || "No Title";
          const price =
            el.querySelector(".price-new .value")?.textContent || "No Price";
          const link =
            el.querySelector(".pr-img-link")?.getAttribute("href") || "#";

          const writer =
            el.querySelector(".author span")?.textContent.trim() || "No Writer";

          const publisher =
            el.querySelector(".publisher span")?.textContent || "No Publisher";

          const imageSrc =
            el.querySelector(".cover img").getAttribute("src") || "";

          results.push({ publisher, title, writer, price, link, imageSrc });
        });

        setProducts(results);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchText, sortOption]);

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}

export default Kitapyurdu;
