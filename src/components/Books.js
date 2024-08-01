import React, { useState, useMemo } from "react";
import { Table, Form, Row, Col, Spinner } from "react-bootstrap";

export default function Books({ products, loading, source = "" }) {
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [sortOption, setSortOption] = useState("recommended"); // Varsayılan sıralama

  if (loading && selectedAuthor !== "") {
    setSelectedAuthor("");
    console.log("clear selectedAuthor ");
  }

  if (loading && selectedPublisher !== "") {
    setSelectedPublisher("");
    console.log("clear selectedPublisher ");
  }

  if (loading && sortOption !== "recommended") {
    setSortOption("recommended");
  }

  const stores = {
    kitapyurdu: {
      key: "kitapyurdu",
      title: "Kitapyurdu",
      url: "kitapyurdu.com",
    },
    trendyol: {
      key: "trendyol",
      title: "Trendyol",
      url: "trendyol.com",
    },
    hepsiburada: {
      key: "hepsiburada",
      title: "Hepsiburada",
      url: "hepsiburada.com",
    },
    amazon: {
      key: "amazon",
      title: "Amazon",
      url: "amazon.com.tr",
    },
    dr: {
      key: "dr",
      title: "D&R",
      url: "dr.com.tr",
    },
  };

  const handleClearFilters = (event) => {
    event.preventDefault(); // Linkin varsayılan davranışını engelle

    setSelectedAuthor(""); // Yazar filtresini temizle
    setSelectedPublisher(""); // Yayıncı filtresini temizle
    setSortOption("recommended"); // Varsayılan sıralama seçeneğine döndür

    // Ürünleri yeniden göster (opsiyonel)
    // setProducts(originalProducts); // Eğer filtrelenmiş ürünleri saklıyorsanız
  };
  // Filtreleme ve sıralama fonksiyonu
  const filteredAndSortedProducts = useMemo(() => {
    // Filtreleme
    const filtered = products.filter((product) => {
      const matchesAuthor = selectedAuthor
        ? product.writer.includes(selectedAuthor)
        : true;
      const matchesPublisher = selectedPublisher
        ? product.publisher.includes(selectedPublisher)
        : true;
      return matchesAuthor && matchesPublisher;
    });

    const parsePrice = (priceString) => {
      const price = priceString
        .replaceAll(" ", "")
        .replaceAll("TL", "")
        .replaceAll(".", "")
        .replaceAll(",", ".");

      const result = parseFloat(price);
      return result;
    };

    // Sıralama
    const sorted = [...filtered].sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);

      switch (sortOption) {
        case "ascending":
          return priceA - priceB;
        case "descending":
          return priceB - priceA;
        default: // recommended (varsayılan sıralama)
          return 0; // Varsayılan sıralama, değişiklik yapmaz
      }
    });

    return sorted;
  }, [products, selectedAuthor, selectedPublisher, sortOption]);

  // Yazar ve yayınevi seçeneklerini oluşturma

  let authors = [...new Set(products.map((product) => product.writer))].sort();
  let publishers = [
    ...new Set(products.map((product) => product.publisher)),
  ].sort();

  // Seçilen yazar varsa, sadece bu yazarın bulunduğu yayınevlerini göster
  publishers =
    selectedAuthor !== ""
      ? [
          ...new Set(
            products
              .filter((product) => product.writer === selectedAuthor)
              .map((product) => product.publisher)
          ),
        ].sort()
      : publishers;

  // Seçilen yayınevi varsa, sadece bu yayınevindeki yazarları göster
  authors =
    selectedPublisher !== ""
      ? [
          ...new Set(
            products
              .filter((product) => product.publisher === selectedPublisher)
              .map((product) => product.writer)
          ),
        ].sort()
      : authors;

  function formatPrice(price) {
    let formattedPrice = price;

    if (formattedPrice.indexOf(",") < 0) formattedPrice += ",00";
    return formattedPrice + " TL";
  }

  let totalStr = !loading ? (
    products.length > 0 ? (
      <span>
        <strong>{filteredAndSortedProducts.length + " sonuç bulundu"}</strong>
      </span>
    ) : (
      <span>Sonuç yok</span>
    )
  ) : (
    <span style={{ color: "darkred" }}>Yükleniyor..</span>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: "10px",
        height: "calc(100% - 240px)",
      }}
    >
      <div className="filter-form">
        <div className="mb-3" style={{ width: "200px" }}>
          <Form.Group controlId="authorFilter">
            <Form.Label
              style={{
                textAlign: "left",
                display: "block",
              }}
            >
              Yazar :
            </Form.Label>
            <Form.Select
              className="mb-4"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option value="">Tüm Yazarlar</option>
              {authors.map((author, index) => (
                <option key={index} value={author}>
                  {author}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="publisherFilter">
            <Form.Label
              style={{
                textAlign: "left",
                display: "block",
              }}
            >
              Yayınevi :
            </Form.Label>
            <Form.Select
              className="mb-3"
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
            >
              <option value="">Tüm Yayınevleri</option>
              {publishers.map((publisher, index) => (
                <option key={index} value={publisher}>
                  {publisher}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="sortOption">
            <Form.Label style={{ textAlign: "left", display: "block" }}>
              Sıralama :
            </Form.Label>
            <Form.Select
              as="select"
              className="custom-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="recommended">Önerilen</option>
              <option value="ascending">Artan Fiyat</option>
              <option value="descending">Azalan Fiyat</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="mb-3">{totalStr}</div>

        <a href="#" onClick={handleClearFilters}>
          Temizle
        </a>
      </div>

      <div
        className="product-list"
        style={{
          padding: "10px",
          width: "100%",
          height: "100%",
        }}
      >
        {loading ? (
          <div>
            <Spinner color="darkred" />
            <div style={{ fontSize: "14px", fontWeight: "600" }}>
              Yükleniyor..
            </div>
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Mağaza</th>
                <th>Görsel</th>
                <th>Yayınevi</th>
                <th>Kitap Adı</th>
                <th>Yazar</th>
                <th>Fiyat</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProducts.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div>
                      <img
                        width={35}
                        style={{ borderRadius: "4px" }}
                        alt={product.store}
                        src={`/logos/${product.store}.png`}
                      />
                    </div>
                    <a
                      href={"https://" + stores[product.store].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-link"
                    >
                      {stores[product.store].url}
                    </a>
                  </td>

                  <td>
                    <img width={80} alt="" src={product.imageSrc}></img>
                  </td>
                  <td>{product.publisher}</td>
                  <td>{product.title}</td>
                  <td>{product.writer}</td>
                  <td className="td-price">{formatPrice(product.price)}</td>
                  <td style={{ verticalAlign: "middle" }}>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Gözat
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div style={{ fontWeight: "600" }}>Sonuç yok</div>
        )}
      </div>
    </div>
  );
}
