import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";

const URL = "http://localhost:5000/api/fetch/amazon";
const storeBaseUrl = "https://www.amazon.com.tr";

export default function Amazon({ searchText }) {
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
        const searchUrl = `${URL}?query=${encodeURIComponent(searchText)}`;

        const response = await fetch(searchUrl);
        const data = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");

        const productList = doc
          .querySelector(".s-search-results")
          .querySelectorAll('[data-component-type="s-search-result"]');

        if (!productList) {
          console.error("Product list not found.");
          return;
        }

        const results = [];
        productList.forEach((el) => {
          const title =
            el.querySelector('[data-cy="title-recipe"]')?.textContent ||
            "No Title";

          let price =
            el.querySelector('[data-cy="price-recipe"] .a-price-whole')
              ?.textContent || "No Price";
          if (price !== "No Price") price += "00";

          const link =
            storeBaseUrl +
            (el
              .querySelector('[data-cy="title-recipe"] h2 a')
              ?.getAttribute("href") || "");

          const writer = "-";
          const publisher = "-";
          // const writer =
          //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

          // const publisher =
          //   el.querySelector(".publisher span")?.textContent || "No Publisher";

          const imageSrc =
            el.querySelector(".s-image").getAttribute("src") || "";

          const arr = searchText?.split(" ") || [];

          if (price !== "No Price") {
            results.push({ publisher, title, writer, price, link, imageSrc });
          }
        });

        setProducts(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while fetching products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchText]);

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}
