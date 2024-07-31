import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import SearchForm from "./components/SearchForm";
import Kitapyurdu from "./components/Kitapyurdu";
import Hepsiburada from "./components/Hepsiburada";
import Trendyol from "./components/Trendyol";
import { Tab, Tabs } from "react-bootstrap";
import "./App.css";
import Amazon from "./components/Amazon";
import Dr from "./components/Dr";
import * as utils from "./utils.js";
import { all } from "axios";
import Books from "./components/Books.js";
import { IoBookSharp } from "react-icons/io5";
import { TbWorldSearch } from "react-icons/tb";
import { ImBooks } from "react-icons/im";
import TableSvg from "./TableSvg.js";
function App() {
  const [query, setQuery] = useState("");
  const [key, setKey] = useState("All");
  const [sortOption, setSortOption] = useState("recommended");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchText, sortOption) => {
    // setQuery(searchText);
    // setSortOption(sortOption);
    // API çağrılarını paralel olarak başlatın
    setLoading(true);
    setProducts([]);
    console.log("sort option : " + sortOption);
    console.log("fetching producs...");
    const kitapyurduPromise = utils.getKitapYurduProducts(
      searchText,
      sortOption
    );
    const trendyolPromise = utils.getTrendyolProducts(searchText, sortOption);
    const amazonPromise = utils.getAmazonProducts(searchText);
    const drPromise = utils.getDrproducts(searchText, sortOption);
    const hepsiburadaPromise = utils.getHepsiburadaProducts(
      searchText,
      sortOption
    );

    try {
      const [
        kitapyurduResponse,
        trendyolResponse,
        amazonResponse,
        drResponse,
        hepsiburadaResponse,
      ] = await Promise.all([
        kitapyurduPromise,
        trendyolPromise,
        amazonPromise,
        drPromise,
        hepsiburadaPromise,
      ]);

      let allProducts = [];

      if (kitapyurduResponse.ok && kitapyurduResponse.data.length > 0) {
        console.log(
          "kitapyurduResponse count : ",
          kitapyurduResponse.data.length
        );
        allProducts.push(...kitapyurduResponse.data);
      }

      if (trendyolResponse.ok && trendyolResponse.data.length > 0) {
        console.log("trendyolResponse  count : ", trendyolResponse.data.length);
        allProducts.push(...trendyolResponse.data);
      }

      if (amazonResponse.ok && amazonResponse.data.length > 0) {
        console.log("amazonResponse  count : ", amazonResponse.data.length);
        allProducts.push(...amazonResponse.data);
      }

      if (drResponse.ok && drResponse.data.length > 0) {
        console.log("drResponse  count : ", drResponse.data.length);
        allProducts.push(...drResponse.data);
      }

      if (hepsiburadaResponse.ok && hepsiburadaResponse.data.length > 0) {
        console.log(
          "hepsiburadaResponse  count : ",
          hepsiburadaResponse.data.length
        );
        allProducts.push(...hepsiburadaResponse.data);
      }

      if (allProducts.length > 0) {
        setProducts(allProducts);
      }

      setLoading(false);
      console.log("all products : ", allProducts);
    } catch (error) {
      console.error("API çağrılarında bir hata oluştu:", error);
    }
  };

  const stores = useMemo(
    () => ({
      kitapyurdu: "kitapyurdu",
      trendyol: "trendyol",
      hepsiburada: "hepsiburada",
      amazon: "amazon",
      dr: "dr",
    }),
    []
  );

  useEffect(() => {
    if (products.length === 0) return;
    console.log("products changed..");
    console.log("products count : ", products.length);
  }, [products]);

  const filterProducts = (storeName) => {
    if (products.length === 0) return [];

    const result = products.filter((product) => product.store === storeName);

    return result;
  };

  const parsePrice = (priceString) => {
    const price = priceString
      .replaceAll(" ", "")
      .replaceAll("TL", "")
      .replaceAll(".", "")
      .replaceAll(",", ".");

    const result = parseFloat(price);
    return result;
  };

  const books = useMemo(
    () => ({
      all: products,
      kitapyurdu: products.filter((p) => p.store === stores.kitapyurdu),
      trendyol: products.filter((p) => p.store === stores.trendyol),
      hepsiburada: products.filter((p) => p.store === stores.hepsiburada),
      amazon: products.filter((p) => p.store === stores.amazon),
      dr: products.filter((p) => p.store === stores.dr),
    }),
    [products, stores]
  );

  useLayoutEffect(() => {
    const allTab = document.querySelector("#controlled-tab-example-tab-All");
    const kitapyurduTab = document.querySelector(
      "#controlled-tab-example-tab-Kitapyurdu"
    );
    const trendyolTab = document.querySelector(
      "#controlled-tab-example-tab-Trendyol"
    );
    const hepsiburadaTab = document.querySelector(
      "#controlled-tab-example-tab-Hepsiburada"
    );
    const amazonTab = document.querySelector(
      "#controlled-tab-example-tab-Amazon"
    );
    const drTab = document.querySelector("#controlled-tab-example-tab-Dr");

    if (allTab.querySelectorAll(".item-count").length === 0) {
      const newElement = document.createElement("span");
      newElement.textContent = books.all.length;
      newElement.className = "item-count";
      allTab.appendChild(newElement);
    } else {
      allTab.querySelectorAll(".item-count")[0].textContent = books.all.length;
    }

    if (kitapyurduTab.querySelectorAll(".item-count").length === 0) {
      const newElement = document.createElement("span");
      newElement.textContent = books.kitapyurdu.length;
      newElement.className = "item-count";
      kitapyurduTab.appendChild(newElement);
    } else {
      kitapyurduTab.querySelectorAll(".item-count")[0].textContent =
        books.kitapyurdu.length;
    }

    if (trendyolTab.querySelectorAll(".item-count").length === 0) {
      const newElement = document.createElement("span");
      newElement.textContent = books.trendyol.length;
      newElement.className = "item-count";
      trendyolTab.appendChild(newElement);
    } else {
      trendyolTab.querySelectorAll(".item-count")[0].textContent =
        books.trendyol.length;
    }

    if (hepsiburadaTab.querySelectorAll(".item-count").length === 0) {
      const newElement = document.createElement("span");
      newElement.textContent = books.hepsiburada.length;
      newElement.className = "item-count";
      hepsiburadaTab.appendChild(newElement);
    } else {
      hepsiburadaTab.querySelectorAll(".item-count")[0].textContent =
        books.hepsiburada.length;
    }

    if (amazonTab.querySelectorAll(".item-count").length === 0) {
      const newElement = document.createElement("span");
      newElement.textContent = books.amazon.length;
      newElement.className = "item-count";
      amazonTab.appendChild(newElement);
    } else {
      amazonTab.querySelectorAll(".item-count")[0].textContent =
        books.amazon.length;
    }

    if (drTab.querySelectorAll(".item-count").length === 0) {
      const newElement = document.createElement("span");
      newElement.textContent = books.dr.length;
      newElement.className = "item-count";
      drTab.appendChild(newElement);
    } else {
      drTab.querySelectorAll(".item-count")[0].textContent = books.dr.length;
    }

    const tabSpanList = document.querySelectorAll("span.item-count");
    if (tabSpanList.length > 0) {
      tabSpanList.forEach((span) => {
        const value = span.textContent.trim();
        if (value === "0" && !span.classList.contains("zero-count")) {
          span.classList.add("zero-count");
        } else if (value !== "0" && span.classList.contains("zero-count")) {
          span.classList.remove("zero-count");
        }
      });
    }
  }, [books]);
  return (
    <div className="App">
      <div className="header" style={{ height: "250px" }}>
        <div className="header-img">
          <TableSvg />
        </div>
        <div style={{ fontSize: "53px" }}>
          <ImBooks color="rgb(165 38 62)" />
          <span style={{ marginLeft: "20px" }}>Kitap Arama</span>
        </div>
        <div className="filter mb-5">
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* <Books
        products={products.sort(
          (a, b) => parsePrice(a.price) - parsePrice(b.price)
        )}
      /> */}

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        variant="underline"
        fill
      >
        <Tab eventKey="All" title={`Tümü`}>
          <Books products={books.all} loading={loading} />
        </Tab>
        <Tab eventKey="Kitapyurdu" title={`Kitapyurdu`}>
          <Books products={books.hepsiburada} loading={loading} />
        </Tab>
        <Tab eventKey="Trendyol" title={`Trendyol`}>
          <Books products={books.trendyol} loading={loading} />
        </Tab>
        <Tab eventKey="Hepsiburada" title={`Hepsiburada`}>
          <Books products={books.hepsiburada} loading={loading} />
        </Tab>
        <Tab eventKey="Amazon" title={`Amazon`}>
          <Books products={books.amazon} loading={loading} />
        </Tab>
        <Tab eventKey="Dr" title={`D&R`}>
          <Books products={books.dr} loading={loading} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
