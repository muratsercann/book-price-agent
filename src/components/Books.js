import { Table } from "react-bootstrap";

export default function Books({ products }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>No</th>
          <th>Görsel</th>
          <th>Yayınevi</th>
          <th>Kitap Adı</th>
          <th>Yazar</th>
          <th>Fiyat</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((product, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>
                <img width={40} alt="" src={product.imageSrc}></img>
              </td>
              <td>{product.publisher}</td>
              <td>{product.title}</td>
              <td>{product.writer}</td>
              <td>{product.price}</td>
              <td>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gözat
                </a>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3">No products found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
