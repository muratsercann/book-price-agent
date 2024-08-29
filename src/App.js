import React, { useEffect, useLayoutEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import "./App.css";
import * as utils from "./utils.js";
import Books from "./components/Books.js";
import { ImBooks } from "react-icons/im";
import TableSvg from "./TableSvg.js";
function App() {
  const [key, setKey] = useState("All");
  const [tabsSortOption, setTabsSortOption] = useState("descending");
  const [kitapyurduLoading, setKitapyurduLoading] = useState(false);
  const [trendyolLoading, setTrendyolLoading] = useState(false);
  const [hepsiburadaLoading, setHepsiburadaLoading] = useState(false);
  const [amazonLoading, setAmazonLoading] = useState(false);
  const [drLoading, setDrLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [kitapyurduProducts, setKitapyurduProducts] = useState([]);
  const [trendyolProducts, setTrendyolProducts] = useState([]);
  const [hepsiburadaProducts, setHepsiburadaProducts] = useState([]);
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [drProducts, setDrProducts] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const handleSearch = async (searchText, sortOption) => {
    console.log("sort option : " + sortOption);
    console.log("fetching producs...");

    setSearchPerformed(true);
    setKitapyurduLoading(true);
    setTrendyolLoading(true);
    setHepsiburadaLoading(true);
    setAmazonLoading(true);
    setDrLoading(true);

    setKitapyurduProducts([]);
    setTrendyolProducts([]);
    setHepsiburadaProducts([]);
    setAmazonProducts([]);
    setDrProducts([]);

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
      const handleResponse = async (
        responsePromise,
        setProductsFn,
        setLoadingFn
      ) => {
        try {
          const response = await responsePromise;
          if (response.ok && response.data.length > 0) {
            console.log(`${setProductsFn.name} count: ${response.data.length}`);
            setProductsFn(response.data);
          }
        } catch (error) {
          console.error(`Error handling response:`, error);
        } finally {
          setLoadingFn(false);
        }
      };

      handleResponse(
        kitapyurduPromise,
        setKitapyurduProducts,
        setKitapyurduLoading
      );
      handleResponse(trendyolPromise, setTrendyolProducts, setTrendyolLoading);
      handleResponse(amazonPromise, setAmazonProducts, setAmazonLoading);
      handleResponse(drPromise, setDrProducts, setDrLoading);
      handleResponse(
        hepsiburadaPromise,
        setHepsiburadaProducts,
        setHepsiburadaLoading
      );
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

    const allProductsLength =
      kitapyurduProducts.length +
      trendyolProducts.length +
      hepsiburadaProducts.length +
      amazonProducts.length +
      drProducts.length;

    const handleTab = (tabElement, itemCount, loading = false) => {
      const existingSpinner = tabElement.querySelector(".custom-loader");
      if (existingSpinner) {
        tabElement.removeChild(existingSpinner);
      }

      const existingItemCount = tabElement.querySelector(".item-count");
      if (existingItemCount) {
        tabElement.removeChild(existingItemCount);
      }
      if (loading) {
        const spinner = document.createElement("span");
        spinner.className = "custom-loader";
        tabElement.appendChild(spinner);
      } else {
        if (tabElement.querySelectorAll(".item-count").length === 0) {
          const newElement = document.createElement("span");
          newElement.textContent = itemCount;
          newElement.className = "item-count";
          tabElement.appendChild(newElement);
        } else {
          tabElement.querySelectorAll(".item-count")[0].textContent = itemCount;
        }
      }
    };

    handleTab(allTab, allProductsLength);
    handleTab(kitapyurduTab, kitapyurduProducts.length, kitapyurduLoading);
    handleTab(trendyolTab, trendyolProducts.length, trendyolLoading);
    handleTab(hepsiburadaTab, hepsiburadaProducts.length, hepsiburadaLoading);
    handleTab(amazonTab, amazonProducts.length, amazonLoading);
    handleTab(drTab, drProducts.length, drLoading);

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
  }, [
    kitapyurduProducts,
    trendyolProducts,
    hepsiburadaProducts,
    amazonProducts,
    drProducts,
    amazonLoading,
    drLoading,
    trendyolLoading,
    kitapyurduLoading,
    hepsiburadaLoading,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      // Sayfa 300 piksel aşağı kaydığında buton görünür olacak
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Scroll eventini dinle
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="App">
      <div className="header" style={{ height: "250px" }}>
        <div className="header-img">
          <TableSvg />
        </div>
        <div style={{ fontSize: "53px" }}>
          <ImBooks color="rgb(165 38 62)" />
          <span style={{ marginLeft: "20px" }}>En Uygun Kitap</span>
        </div>
        <div className="filter mb-5">
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        variant="underline"
        fill
      >
        <Tab eventKey="All" title={`Tümü`}>
          <Books
            products={[
              ...kitapyurduProducts,
              ...trendyolProducts,
              ...hepsiburadaProducts,
              ...amazonProducts,
              ...drProducts,
            ]}
            loading={
              kitapyurduLoading ||
              trendyolLoading ||
              hepsiburadaLoading ||
              amazonLoading ||
              drLoading
            }
            sortOption={tabsSortOption}
            setSortOption={setTabsSortOption}
            searchPerformed={searchPerformed}
          />
        </Tab>
        <Tab eventKey="Kitapyurdu" title={`Kitapyurdu`}>
          <Books
            products={kitapyurduProducts}
            loading={kitapyurduLoading}
            sortOption={tabsSortOption}
            setSortOption={setTabsSortOption}
            searchPerformed={searchPerformed}
          />
        </Tab>
        <Tab eventKey="Hepsiburada" title={`Hepsiburada`}>
          <Books
            products={hepsiburadaProducts}
            loading={hepsiburadaLoading}
            sortOption={tabsSortOption}
            setSortOption={setTabsSortOption}
            searchPerformed={searchPerformed}
          />
        </Tab>
        <Tab eventKey="Trendyol" title={`Trendyol`}>
          <Books
            products={trendyolProducts}
            loading={trendyolLoading}
            sortOption={tabsSortOption}
            setSortOption={setTabsSortOption}
            searchPerformed={searchPerformed}
          />
        </Tab>
        <Tab eventKey="Amazon" title={`Amazon`}>
          <Books
            products={amazonProducts}
            loading={amazonLoading}
            sortOption={tabsSortOption}
            setSortOption={setTabsSortOption}
            searchPerformed={searchPerformed}
          />
        </Tab>
        <Tab eventKey="Dr" title={`D&R`}>
          <Books
            products={drProducts}
            loading={drLoading}
            sortOption={tabsSortOption}
            setSortOption={setTabsSortOption}
            searchPerformed={searchPerformed}
          />
        </Tab>
      </Tabs>

      <div>
        {showButton && (
          <button onClick={scrollToTop} className="scroll-to-top-button">
            ↑ Yukarı Çık
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
