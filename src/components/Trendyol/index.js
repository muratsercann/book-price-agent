import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";

const URL = "http://localhost:5000/api/fetch/trendyol2";
const storeBaseUrl = "https://www.trendyol.com";

export default function SearchResults({ searchText, sortOption }) {
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
        const searchUrl = `${URL}?query=${encodeURIComponent(
          searchText
        )}&sortOption=${encodeURIComponent(sortOption)}`;

        const response = await fetch(searchUrl);
        const data = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");

        const productList = doc
          .querySelector(".prdct-cntnr-wrppr")
          .querySelectorAll(".p-card-wrppr");

        if (!productList) {
          console.error("Product list not found.");
          return;
        }

        const results = [];
        productList.forEach((el) => {
          const title =
            (el.querySelector(".prdct-desc-cntnr-name")?.textContent || "") +
            " " +
            (el.querySelector(".product-desc-sub-text")?.textContent || "");

          const price =
            el.querySelector(".prc-box-dscntd")?.textContent || "No Price";

          const link =
            storeBaseUrl + (el.querySelector("a")?.getAttribute("href") || "");

          const writer = "-";
          // const publisher = "-";
          // const writer =
          //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

          const publisher =
            el.querySelector(".prdct-desc-cntnr-ttl")?.textContent ||
            "No Publisher";

          const imageSrc =
            el.querySelector("img.p-card-img")?.getAttribute("src") || "";

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
  }, [searchText, sortOption]);

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}
