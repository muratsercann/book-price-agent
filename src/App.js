import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import Kitapyurdu from "./components/Kitapyurdu";
import Hepsiburada from "./components/Hepsiburada";
import Trendyol from "./components/Trendyol";
import { Tab, Tabs } from "react-bootstrap";
import "./App.css";
function App() {
  const [query, setQuery] = useState("");
  const [key, setKey] = useState("Trendyol");

  const handleSearch = (searchText) => {
    setQuery("");
    setQuery(searchText);
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
          {query && <Kitapyurdu searchText={query} />}
        </Tab>
        <Tab eventKey="Trendyol" title="Trendyol">
          {query && <Trendyol searchText={query} />}
        </Tab>
        <Tab eventKey="Hepsiburada" title="Hepsiburada">
          {query && <Hepsiburada searchText={query} />}
        </Tab>
        <Tab eventKey="Amazon" title="Amazon">
          {query && <Hepsiburada searchText={query} />}
        </Tab>
        <Tab eventKey="DNR" title="D&R">
          {query && <Hepsiburada searchText={query} />}
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
