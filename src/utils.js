export const getKitapYurduProducts = async (searchText, sortOption) => {
  const URL = "http://localhost:5000/api/fetch/kitapyurdu";

  try {
    const searchUrl = `${URL}?query=${encodeURIComponent(
      searchText
    )}&sortOption=${encodeURIComponent(sortOption)}`;
    const response = await fetch(searchUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const productTableDiv = doc.querySelector("#product-table");

    if (!productTableDiv) {
      return { ok: true, data: [] };
    }

    const results = [];
    // İçerideki product-cr öğelerini seçin
    productTableDiv.querySelectorAll(".product-cr").forEach((el) => {
      const title = el.querySelector(".name span")?.textContent || "No Title";
      const price =
        el.querySelector(".price-new .value")?.textContent || "No Price";
      const link =
        el.querySelector(".pr-img-link")?.getAttribute("href") || "#";

      const writer =
        el.querySelector(".author span")?.textContent.trim() || "No Writer";

      const publisher =
        el.querySelector(".publisher span")?.textContent || "No Publisher";

      const imageSrc = el.querySelector(".cover img").getAttribute("src") || "";

      results.push({ publisher, title, writer, price, link, imageSrc });
    });

    return { ok: true, data: results };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { ok: false, error: "An error occurred while fetching products." };
  } finally {
  }
};
