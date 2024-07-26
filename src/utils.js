export const getKitapYurduProducts = async (searchText, sortOption) => {
  const apiUri = "http://localhost:5000/api/fetch/kitapyurdu";
  const storeBaseUrl = "https://www.kitapyurdu.com";
  try {
    const searchUrl = `${apiUri}?query=${encodeURIComponent(
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
  }
};

export const getAmazonProducts = async (searchText) => {
  try {
    const apiUri = "http://localhost:5000/api/fetch/amazon";
    const storeBaseUrl = "https://www.amazon.com.tr";

    const searchUrl = `${apiUri}?query=${encodeURIComponent(searchText)}`;

    const response = await fetch(searchUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const productList = doc
      .querySelector(".s-search-results")
      .querySelectorAll('[data-component-type="s-search-result"]');

    if (!productList) {
      return { ok: true, data: [] };
    }

    const results = [];
    productList.forEach((el) => {
      const title =
        el.querySelector('[data-cy="title-recipe"]')?.textContent || "No Title";

      let price =
        el.querySelector('[data-cy="price-recipe"] .a-price-whole')
          ?.textContent || "No Price";
      if (price !== "No Price") price += "00";

      const link =
        storeBaseUrl +
        (el
          .querySelector('[data-cy="title-recipe"] h2 a')
          ?.getAttribute("href") || "");

      const writer = "-";
      const publisher = "-";
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      // const publisher =
      //   el.querySelector(".publisher span")?.textContent || "No Publisher";

      const imageSrc = el.querySelector(".s-image").getAttribute("src") || "";

      const arr = searchText?.split(" ") || [];

      if (price !== "No Price") {
        results.push({ publisher, title, writer, price, link, imageSrc });
      }
    });

    return { ok: true, data: results };
  } catch (error) {
    return { ok: false, error: "An error occurred while fetching products." };
  }
};

export const getDrproducts = async (searchText, sortOption) => {
  try {
    const URL = "http://localhost:5000/api/fetch/dr";
    const storeBaseUrl = "https://www.dr.com.tr/";

    const searchUrl = `${URL}?query=${encodeURIComponent(
      searchText
    )}&sortOption=${encodeURIComponent(sortOption)}`;

    const response = await fetch(searchUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const productList = doc.querySelectorAll(
      "div.facet__products .prd.js-prd-item"
    );

    if (!productList) {
      return { ok: true, data: [] };
    }
    const results = [];
    productList.forEach((el) => {
      const product_info = JSON.parse(el?.getAttribute("data-gtm") || "{}");

      const title = product_info?.item_name || "-";

      const price = product_info?.price || "-";

      const link =
        storeBaseUrl +
        (el.querySelector(".product-img a")?.getAttribute("href") || "");

      const writer = product_info?.author || "-";
      const publisher = product_info?.publisher || "-";
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      // const publisher =
      //   el.querySelector(".publisher span")?.textContent || "No Publisher";

      const imageSrc =
        el.querySelector(".product-img img")?.getAttribute("data-src") || "";

      const arr = searchText?.split(" ") || [];

      if (price !== "No Price") {
        results.push({ publisher, title, writer, price, link, imageSrc });
      }
    });

    return { ok: true, data: results };
  } catch (error) {
    return { ok: false, error: "An error occurred while fetching products." };
  }
};

export const getHepsiburadaProducts = async (searchText, sortOption) => {
  try {
    const URL = "http://localhost:5000/api/fetch/hepsiburada";
    const storeBaseUrl = "https://www.hepsiburada.com";

    const searchUrl = `${URL}?query=${encodeURIComponent(
      searchText
    )}&sortOption=${encodeURIComponent(sortOption)}`;

    const response = await fetch(searchUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const productList = doc.querySelectorAll('li[class^="productListContent"]');

    if (!productList) {
      return { ok: true, data: [] };
    }

    const results = [];
    productList.forEach((el) => {
      const title =
        el.querySelector('[data-test-id="product-card-name"]')?.textContent ||
        "No Title";

      const price =
        el.querySelector('[data-test-id="price-current-price"]')?.textContent ||
        "No Price";

      const link =
        storeBaseUrl + (el.querySelector("a")?.getAttribute("href") || "");

      const writer = "-";
      const publisher = "-";
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      // const publisher =
      //   el.querySelector(".publisher span")?.textContent || "No Publisher";

      const imageSrc = el.querySelector("img")?.getAttribute("src") || "";

      const arr = searchText?.split(" ") || [];

      // if (price !== "No Price" && containsOnlySearchTerms(title, arr)) {
      //   results.push({ publisher, title, writer, price, link, imageSrc });
      // }

      if (price !== "No Price") {
        results.push({ publisher, title, writer, price, link, imageSrc });
      }
    });

    return { ok: true, data: results };
  } catch (error) {
    return { ok: false, error: "An error occurred while fetching products." };
  }
};

export const getTrendyolProducts = async (searchText, sortOption) => {
  try {
    const URL = "http://localhost:5000/api/fetch/trendyol";
    const storeBaseUrl = "https://www.trendyol.com";

    const searchUrl = `${URL}?query=${encodeURIComponent(
      searchText
    )}&sortOption=${encodeURIComponent(sortOption)}`;

    const response = await fetch(searchUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const productList = doc
      .querySelector(".prdct-cntnr-wrppr")
      ?.querySelectorAll(".p-card-wrppr");

    if (!productList) {
      return { ok: true, data: [] };
    }
    const results = [];
    productList.forEach((el) => {
      const title =
        (el.querySelector(".prdct-desc-cntnr-name")?.textContent || "") +
        " " +
        (el.querySelector(".product-desc-sub-text")?.textContent || "");

      const price =
        el.querySelector(".prc-box-dscntd")?.textContent || "No Price";

      const link =
        storeBaseUrl + (el.querySelector("a")?.getAttribute("href") || "");

      const writer = "-";
      // const publisher = "-";
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      const publisher =
        el.querySelector(".prdct-desc-cntnr-ttl")?.textContent ||
        "No Publisher";

      const imageSrc =
        el.querySelector("img.p-card-img")?.getAttribute("src") || "";

      const arr = searchText?.split(" ") || [];

      if (price !== "No Price") {
        results.push({ publisher, title, writer, price, link, imageSrc });
      }
    });

    return { ok: true, data: results };
  } catch (error) {
    return { ok: false, error: "An error occurred while fetching products." };
  }
};
