import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor

function SearchForm({ onSearch }) {
  const [searchText, setSearchText] = useState(
    "Kürk Mantolu Madonna Sabahattin Ali"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
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
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchForm;
