import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import Kitapyurdu from "./components/Kitapyurdu";
import Hepsiburada from "./components/Hepsiburada";
import Trendyol from "./components/Trendyol";
import { Tab, Tabs } from "react-bootstrap";
import "./App.css";
import Amazon from "./components/Amazon";
import Dr from "./components/Dr";
function App() {
  const [query, setQuery] = useState("");
  const [key, setKey] = useState("Trendyol");
  const [sortOption, setSortOption] = useState("recommended");

  const handleSearch = (searchText, sortOption) => {
    setQuery(null);
    setQuery(searchText);
    setSortOption(sortOption);
  };

  return (
    <div className="App">
      <div style={{ fontSize: "53px" }}>Kitap Arama</div>
      <div className="filter mb-5">
        <SearchForm onSearch={handleSearch} />
      </div>

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="Kitapyurdu" title="Kitapyurdu">
          {query && sortOption && (
            <Kitapyurdu searchText={query} sortOption={sortOption} />
          )}
        </Tab>
        <Tab eventKey="Trendyol" title="Trendyol">
          {query && sortOption && (
            <Trendyol searchText={query} sortOption={sortOption} />
          )}
        </Tab>
        <Tab eventKey="Hepsiburada" title="Hepsiburada">
          {query && sortOption && (
            <Hepsiburada searchText={query} sortOption={sortOption} />
          )}
        </Tab>
        <Tab eventKey="Amazon" title="Amazon">
          {query && sortOption && <Amazon searchText={query} />}
        </Tab>
        <Tab eventKey="DNR" title="D&R">
          {query && sortOption && (
            <Dr searchText={query} sortOption={sortOption} />
          )}
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
