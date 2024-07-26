import React, { useEffect, useState } from "react";
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
function App() {
  const [query, setQuery] = useState("");
  const [key, setKey] = useState("Kitapyurdu");
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

  const stores = {
    kitapyurdu: "kitapyurdu",
    trendyol: "trendyol",
    hepsiburada: "hepsiburada",
    amazon: "amazon",
    dr: "dr",
  };
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

  return (
    <div className="App">
      <div className="header" style={{ height: "250px" }}>
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
        <Tab eventKey="All" title="Tümü">
          <Books products={products} loading={loading} />
        </Tab>
        <Tab eventKey="Kitapyurdu" title="Kitapyurdu">
          <Books
            products={products.filter((p) => p.store === stores.kitapyurdu)}
            loading={loading}
          />
        </Tab>
        <Tab eventKey="Trendyol" title="Trendyol">
          <Books
            products={products.filter((p) => p.store === stores.trendyol)}
            loading={loading}
          />
        </Tab>
        <Tab eventKey="Hepsiburada" title="Hepsiburada">
          <Books
            products={products.filter((p) => p.store === stores.hepsiburada)}
            loading={loading}
          />
        </Tab>
        <Tab eventKey="Amazon" title="Amazon">
          <Books
            products={products.filter((p) => p.store === stores.amazon)}
            loading={loading}
          />
        </Tab>
        <Tab eventKey="DNR" title="D&R">
          <Books
            products={products.filter((p) => p.store === stores.dr)}
            loading={loading}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
