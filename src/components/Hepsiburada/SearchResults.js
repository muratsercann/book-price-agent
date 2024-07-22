import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor
import Books from "../Books";

const URL = "https://www.hepsiburada.com/ara?siralama=azalanfiyat&q=";

function SearchResults({ query }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const searchUrl = `${URL}${encodeURIComponent(`${query.title}`)}`;
        console.log(searchUrl);
        const response = await fetch(
          `https://cors-anywhere.herokuapp.com/${searchUrl}`
        );
        const data = await response.text();

        // HTML içeriğini kontrol edin
        // console.log(data);

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");

        // İçeriği kontrol edin
        //console.log(doc.documentElement.innerHTML);

        // Hedef div'i seçin
        const productTableDiv = doc.querySelector(".product-list");

        if (!productTableDiv) {
          console.error("Product table div not found.");
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
            el.querySelector(".author span").textContent.trim() || "No Writer";

          const publisher =
            el.querySelector(".publisher span")?.textContent || "No Publisher";

          const imageSrc =
            el.querySelector(".cover img").getAttribute("src") || "";
          results.push({ publisher, title, writer, price, link, imageSrc });
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
  }, [query]);

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (loading) return <>Searching..</>;
  return <Books products={products} />;
}

export default SearchResults;
