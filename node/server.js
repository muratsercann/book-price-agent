const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());

app.get("/api/fetch/kitapyurdu", async (req, res) => {
  try {
    const url = "https://www.kitapyurdu.com";
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});
app.get("/api/fetch/hepsiburada", async (req, res) => {
  try {
    const { query } = req.query; // URL parametresinden arama terimini al

    console.log("search query : ", query);

    const url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(
      query
    )}&siralama=azalanfiyat`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
