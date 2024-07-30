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
      const store = "kitapyurdu";
      const title = (
        el.querySelector(".name span")?.textContent || "No Title"
      ).trim();
      let price = (
        el.querySelector(".price-new .value")?.textContent || "No Price"
      ).trim();
      if (price !== "No Price")
        price = price.replace("TL", "").replaceAll(" ", "");

      const link = (
        el.querySelector(".pr-img-link")?.getAttribute("href") || "#"
      ).trim();

      const writer = (
        el.querySelector(".author span")?.textContent.trim() || "No Writer"
      )
        .trim()
        .toLocaleUpperCase("tr-TR");

      const publisher = (
        el.querySelector(".publisher span")?.textContent || "No Publisher"
      )
        .trim()
        .toLocaleUpperCase("tr-TR");

      const imageSrc = (
        el.querySelector(".cover img").getAttribute("src") || ""
      ).trim();

      results.push({ store, publisher, title, writer, price, link, imageSrc });
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
      const store = "amazon";
      const title = (
        el.querySelector('[data-cy="title-recipe"]')?.textContent || "No Title"
      ).trim();

      let price = (
        el.querySelector('[data-cy="price-recipe"] .a-price-whole')
          ?.textContent || "No Price"
      ).trim();

      if (price !== "No Price") {
        price += "00";
        price = price.replace("TL", "").replaceAll(" ", "");
      }

      const link = (
        storeBaseUrl +
        (el
          .querySelector('[data-cy="title-recipe"] h2 a')
          ?.getAttribute("href") || "")
      ).trim();

      const writer = "-";
      const publisher = "-";
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      // const publisher =
      //   el.querySelector(".publisher span")?.textContent || "No Publisher";

      const imageSrc = (
        el.querySelector(".s-image").getAttribute("src") || ""
      ).trim();

      const arr = searchText?.split(" ") || [];

      if (price !== "No Price") {
        results.push({
          store,
          publisher,
          title,
          writer,
          price,
          link,
          imageSrc,
        });
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

      const store = "dr";

      const title = (product_info?.item_name || "-").trim();

      let price = (product_info?.price || "No Price").trim();
      if (price !== "No Price")
        price = price.replace("TL", "").replaceAll(" ", "").replace(".", ","); //for only dr.

      const link = (
        storeBaseUrl +
        (el.querySelector(".product-img a")?.getAttribute("href") || "")
      ).trim();

      const writer = (product_info?.author || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");
      const publisher = (product_info?.publisher || "-")
        .trim()
        .toLocaleUpperCase("tr-TR");
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      // const publisher =
      //   el.querySelector(".publisher span")?.textContent || "No Publisher";

      const imageSrc = (
        el.querySelector(".product-img img")?.getAttribute("data-src") || ""
      ).trim();

      const arr = searchText?.split(" ") || [];

      if (price !== "No Price") {
        results.push({
          store,
          publisher,
          title,
          writer,
          price,
          link,
          imageSrc,
        });
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
      const store = "hepsiburada";
      const title = (
        el.querySelector('[data-test-id="product-card-name"]')?.textContent ||
        "No Title"
      ).trim();

      let price = (
        el.querySelector('[data-test-id="price-current-price"]')?.textContent ||
        "No Price"
      ).trim();

      if (price !== "No Price")
        price = price.replace("TL", "").replaceAll(" ", "");

      const link = (
        storeBaseUrl + (el.querySelector("a")?.getAttribute("href") || "")
      ).trim();

      const writer = "-";
      const publisher = "-";
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      // const publisher =
      //   el.querySelector(".publisher span")?.textContent || "No Publisher";

      const imageSrc = (
        el.querySelector("img")?.getAttribute("src") || ""
      ).trim();

      const arr = searchText?.split(" ") || [];

      // if (price !== "No Price" && containsOnlySearchTerms(title, arr)) {
      //   results.push({ publisher, title, writer, price, link, imageSrc });
      // }

      if (price !== "No Price") {
        results.push({
          store,
          publisher,
          title,
          writer,
          price,
          link,
          imageSrc,
        });
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
      const store = "trendyol";
      const title = (
        (el.querySelector(".prdct-desc-cntnr-name")?.textContent || "") +
        " " +
        (el.querySelector(".product-desc-sub-text")?.textContent || "")
      ).trim();

      let price = (
        el.querySelector(".prc-box-dscntd")?.textContent || "No Price"
      ).trim();
      if (price !== "No Price")
        price = price.replace("TL", "").replaceAll(" ", "");

      const link = (
        storeBaseUrl + (el.querySelector("a")?.getAttribute("href") || "")
      ).trim();

      const writer = "-";
      // const publisher = "-";
      // const writer =
      //   el.querySelector(".author span")?.textContent.trim() || "No Writer";

      const publisher = (
        el.querySelector(".prdct-desc-cntnr-ttl")?.textContent || "No Publisher"
      )
        .trim()
        .toLocaleUpperCase("tr-TR");

      const imageSrc = (
        el.querySelector("img.p-card-img")?.getAttribute("src") || ""
      ).trim();

      const arr = searchText?.split(" ") || [];

      if (price !== "No Price") {
        results.push({
          store,
          publisher,
          title,
          writer,
          price,
          link,
          imageSrc,
        });
      }
    });

    return { ok: true, data: results };
  } catch (error) {
    return { ok: false, error: "An error occurred while fetching products." };
  }
};
