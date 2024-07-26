import { Table } from "react-bootstrap";

export default function Books({ products }) {
  let totalStr = "";

  function formatPrice(price) {
    let formattedPrice = price;

    if (formattedPrice.indexOf(",") < 0) formattedPrice += ",00";
    return formattedPrice + " TL";
    // return price.toLocaleString("tr-TR", {
    //   style: "currency",
    //   currency: "TRY",
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2,
    // });
  }

  if (products.length > 0) {
    totalStr = (
      <span>
        <strong>{products.length + " books"}</strong> {" found"}
      </span>
    );
  } else {
    totalStr = <span>No books found</span>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <div className="mb-3">{totalStr}</div>
      {products && products.length > 0 && (
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
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.store}</td>
                  <td>
                    <img width={40} alt="" src={product.imageSrc}></img>
                  </td>
                  <td>{product.publisher}</td>
                  <td>{product.title}</td>
                  <td>{product.writer}</td>
                  <td>{formatPrice(product.price)}</td>
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
      )}
    </div>
  );
}
