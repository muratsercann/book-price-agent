import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap"; // react-bootstrap bileşenleri import ediliyor

function SearchForm({ onSearch }) {
  const [bookTitle, setBookTitle] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(bookTitle, authorName);
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBookTitle">
              <Form.Label>Kitap İsmi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Kitap İsmi"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAuthorName" className="mt-3">
              <Form.Label>Yazar İsmi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Yazar İsmi"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Ara
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchForm;
