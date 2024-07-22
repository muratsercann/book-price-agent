import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
// import SearchResults from "./components/Kitapyurdu/SearchResults";
import SearchResults from "./components/Hepsiburada/SearchResults";
function App() {
  const [query, setQuery] = useState("");

  const handleSearch = (searchText) => {
    setQuery("");
    setQuery(searchText);
  };

  return (
    <div className="App">
      <h1>Kitap Arama</h1>
      <SearchForm onSearch={handleSearch} />
      {query && <SearchResults searchText={query} />}
    </div>
  );
}

export default App;
