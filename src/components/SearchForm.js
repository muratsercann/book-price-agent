import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor

function SearchForm({ onSearch }) {
  const [searchText, setSearchText] = useState(
    "Kürk Mantolu Madonna Sabahattin Ali"
  );

  const [sortOption, setSortOption] = useState("recommended");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText, sortOption);
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Aranacak Öğe Giriniz"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                required
              />
              <Button variant="primary" type="submit">
                Ara
              </Button>
            </InputGroup>
            <Form.Select
              aria-label="Sıralama Seçeneği"
              value={sortOption}
              onChange={(e) => {
                onSearch(searchText, e.target.value);
                setSortOption(e.target.value);
              }}
            >
              <option value="recommended">Önerilen</option>
              <option value="highPrice">Yüksek Fiyat</option>
            </Form.Select>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchForm;
