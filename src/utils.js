export const getKitapYurduProducts = async (searchText, sortOption) => {
  const apiUri = "http://localhost:5000/api/fetch/kitapyurdu";
  const storeBaseUrl = "https://www.kitapyurdu.com";
  try {
    const searchUrl = `${apiUri}?query=${encodeURIComponent(
      searchText
    )}&sortOption=${encodeURIComponent(sortOption)}`;
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(
        response.error || `HTTP error! status: ${response.status}`
      );
    }
    const jsonResult = await response.json();
    return { ok: true, data: jsonResult.data };
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
    if (!response.ok) {
      throw new Error(
        response.error || `HTTP error! status: ${response.status}`
      );
    }
    const jsonResult = await response.json();
    return { ok: true, data: jsonResult.data };
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
    if (!response.ok) {
      throw new Error(
        response.error || `HTTP error! status: ${response.status}`
      );
    }
    const jsonResult = await response.json();
    return { ok: true, data: jsonResult.data };
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

    if (!response.ok) {
      throw new Error(
        response.error || `HTTP error! status: ${response.status}`
      );
    }

    const jsonResult = await response.json();
    return { ok: true, data: jsonResult.data };
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

    if (!response.ok) {
      throw new Error(
        response.error || `HTTP error! status: ${response.status}`
      );
    }

    const jsonResult = await response.json();
    return { ok: true, data: jsonResult.data };
  } catch (error) {
    return { ok: false, error: "An error occurred while fetching products." };
  }
};
