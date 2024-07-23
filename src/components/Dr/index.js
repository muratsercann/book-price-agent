import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";

const URL = "http://localhost:5000/api/fetch/dr";
const storeBaseUrl = "https://www.dr.com.tr/";
export default function Dr({ searchText, sortOption }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  }

  function removePunctuation(text) {
    return text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""); // Noktalama işaretlerini temizler
  }

  function containsOnlySearchTerms(text, searchTerms) {
    const cleanedText = removePunctuation(text).toLowerCase();

    let remainingText = cleanedText;

    searchTerms.forEach((term) => {
      const escapedTerm = escapeRegExp(term.toLowerCase());
      const regex = new RegExp(escapedTerm, "gi");
      remainingText = remainingText.replace(regex, "");
    });

    remainingText = remainingText.trim();

    return remainingText.length === 0;
  }

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

        const productList = doc.querySelectorAll(
          "div.facet__products .prd.js-prd-item"
        );

        if (!productList) {
          setProducts([]);
          console.log("No Product found !");
          setLoading(false);
          return;
        }
        const results = [];
        productList.forEach((el) => {
          const product_info = JSON.parse(el?.getAttribute("data-gtm") || "{}");

          const title = product_info?.item_name || "-";

          const price = product_info?.price || "-";

          const link =
            storeBaseUrl +
            (el.querySelector(".product-img a")?.getAttribute("href") || "");

          const writer = product_info?.author || "-";
          const publisher = product_info?.publisher || "-";
          // const writer =
          //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

          // const publisher =
          //   el.querySelector(".publisher span")?.textContent || "No Publisher";

          const imageSrc =
            el.querySelector(".product-img img")?.getAttribute("data-src") ||
            "";

          const arr = searchText?.split(" ") || [];

          if (price !== "No Price") {
            results.push({ publisher, title, writer, price, link, imageSrc });
          }
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
