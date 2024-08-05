const express = require("express");
const kitapyurdu = require("./services/kitapyurdu");
const trendyol = require("./services/trendyol");
const amazon = require("./services/amazon");
const hepsiburada = require("./services/hepsiburada");
const dr = require("./services/dr");
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Server is running :)" });
});

router.get("/kitapyurdu", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await kitapyurdu.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/trendyol", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await trendyol.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/hepsiburada", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await hepsiburada.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/amazon", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await amazon.search(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

router.get("/dr", async (req, res) => {
  const { query, sortOption } = req.query || {};
  const result = await dr.fastSearch(query, sortOption);
  if (result.ok) {
    res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ ...result.error });
  }
});

module.exports = router;
